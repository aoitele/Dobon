import { Redis } from "ioredis"
import { Socket } from 'socket.io'
import { Board, Player } from "../@types/game"
import { EmitForPVE } from "../@types/socket"
import { PVE_COM_USER_NAMES, PVE_UNREGISTERED_NAMES } from "../constant"
import { hasValidQueries, HasValidQueriesArgs } from "../utils/function/hasValidQueries"
import { cpuMainProcess } from "../utils/game/cpu/main"
import { isCpuLevelValue } from "../utils/game/cpu/utils/isCPULevelValue"
import { resEffectName } from "../utils/game/effect"
import { reducerPayloadSpecify } from "../utils/game/roomStateReducer"
import { initialState } from "../utils/game/state"
import { culcNextUserTurn } from "../utils/game/turnInfo"
import { validateRules } from "../utils/validator/rule"
import { isCpuTurnEmitData } from "../utils/validator/validate"
import { redisHandsInit, redisTrashInit } from "./redis/gameProcess"
import { loadDobonRedisKeys } from "./redis/loadDobonRedisKeys"

/**
 * CPU対戦におけるサーバー側の処理
 */
const cpuModeHandler = (io: Socket, socket: any) => {
  console.log('cpuModeHandler')
  const adapterPubClient: Redis = socket.adapter.pubClient

  socket.on('emit', async (payload: EmitForPVE) => {
    console.log(payload, 'payload')
    console.log(socket.id, 'socket.id')
    const { event, gameId } = payload
    console.log(event, 'event')

    // payload.queryを検証、pveKeyが存在しない場合は後続処理を行わない。 
    const hasValidQueriesArgs: HasValidQueriesArgs = {
      query: payload.query,
      target: [{ key: 'pveKey', forceString: true }]
    }

    // イベント毎に必須とするプロパティを追加して検証させる
    if (event === 'prepare') {
      hasValidQueriesArgs.target.push({ key: 'setCount', forceString: true })
    }

    if (!hasValidQueries(hasValidQueriesArgs)) return {}
    const { query } = hasValidQueriesArgs
    const pveKey = `${query.pveKey}`

    switch (event) {
      /**
       * ゲーム開始時の処理
       * nextGameでgame.idが切り替わる時もここから処理が行われる
       */
      case 'prepare': {
        if (typeof gameId !== 'number') return {} // gameIdを検証
        const isFirstGame = gameId === 1

        const loadRedisKey = loadDobonRedisKeys([
          {mode:'pve', type: 'deck', firstKey: pveKey},
          {mode:'pve', type: 'trash', firstKey: pveKey}
        ])
        const deckKey = loadRedisKey[0]
        const trashKey = loadRedisKey[1]

        // deck initialize
        await adapterPubClient.sunionstore(deckKey, 'deck') // Redis copy deck for pve

        const yourName = typeof query?.me === 'string' ? query.me : PVE_UNREGISTERED_NAMES // Using nickname if you LoggedIn
        const users = [yourName, ...PVE_COM_USER_NAMES]
        const userData:Player[] = []
        let myHands:Board['hands'] = []
        const otherHands: Board['otherHands'] = []

        for (let i = 0; i < users.length; i += 1) {
          const isCom = PVE_COM_USER_NAMES.includes(users[i])
          const mode = isCom ? query?.[users[i]] : undefined

          // Hands initialize
          const nickname = isCom ? users[i] : 'me'
          const redisKeys = loadDobonRedisKeys([
            {mode:'pve', type: 'hands', firstKey: pveKey, secondKey: nickname},
            {mode:'pve', type: 'user', firstKey: pveKey, secondKey: nickname},
          ])

          const hands = await redisHandsInit(adapterPubClient, deckKey, redisKeys[0])
          isCom ? otherHands.push({ userId: 0, hands, nickname }) : myHands = hands

          // Score update
          let score = 0
          if (isFirstGame) {
            adapterPubClient.hset(redisKeys[1], 'score', score)
          } else {
            const latestScore = await adapterPubClient.hget(redisKeys[1], 'score') // eslint-disable-line no-await-in-loop
            if (latestScore) {
              score = Number(latestScore)
            }
          }

          userData.push({ id: 0, nickname: users[i], turn: i + 1, score, isWinner: false, isLoser: false, mode: (typeof mode === 'string' && isCpuLevelValue(mode)) ? mode : undefined })
        }

        // Trash initialize
        const initialTrash = await redisTrashInit(adapterPubClient, deckKey, trashKey)
        const deckCount = await adapterPubClient.scard(deckKey)

        const reducerPayload: reducerPayloadSpecify = {
          game: {
            board: {
              users: userData,
              hands: myHands,
              otherHands,
              turn: 1,
              deckCount,
              trash: {
                card: initialTrash,
                user: initialState.game.board.trash.user,
              },
              effect: initialState.game.board.effect,
              bonusCards: initialState.game.board.bonusCards,
            },
            status: 'playing',
            result: initialState.game.result,
            setCount: typeof query.setCount === 'string' ? Number(query.setCount) : null
          },
        }
        socket.emit('updateStateSpecify', reducerPayload) // 送信者を更新
        break
      }
      case 'draw': {
        const loadRedisKey = loadDobonRedisKeys([
          {mode:'pve', type: 'deck', firstKey: pveKey},
          {mode:'pve', type: 'hands', firstKey: pveKey, secondKey: 'me' },
        ])
        const deckKey = loadRedisKey[0]
        const handsKey = loadRedisKey[1]
        const newCard = await adapterPubClient.spop(deckKey, 1)
        await adapterPubClient.sadd(handsKey, newCard)
        const hands = await adapterPubClient.smembers(handsKey)

        // 手札を更新
        const reducerPayload: reducerPayloadSpecify = {
          game: {
            board: {
              hands
            }
          }
        }
        socket.emit('updateStateSpecify', reducerPayload)
        break
      }
      case 'turnchange': {
        const { data } = payload

        if (data?.type !== 'board') break

        // 実行経路(putOut or actionBtn)により処理を分ける
        const byPutout = data.option?.triggered === 'putOut'
        const byActionBtn = data.option?.triggered === 'actionBtn'

        // ボードデータ取得、連続した自分のターンかどうかの判定(=skip効果によるturnchange?)
        const { users, turn, trash, effect } = data.data
        const isMyTurnConsecutive = data.option?.values.isMyTurnConsecutive

        if (users && turn && trash?.card) {
          // Skipカード効果で得た自分の連続ターンでない、純粋に自分のターンが来てカードを出した場合のみeffectNameを取得する
          const effectName = (!isMyTurnConsecutive && byPutout) ? resEffectName({ card: [trash.card], selectedWildCard: null }) : ''
          const isReversed = (typeof effect !== 'undefined') && effect.includes('reverse')
          const nextTurn = culcNextUserTurn(turn, users, effectName, isReversed)
          const reducerPayload: reducerPayloadSpecify = {
            game: {
              board: {
                turn: nextTurn,
              }
            }
          }
          /**
           * どぼんボタンを有効にするかの状態制御
           * actionBtnでスキップされた場合、全員どぼん実行は許可しない
           */
          if (byActionBtn && reducerPayload.game?.board) {
            reducerPayload.game.board.allowDobon = false
          }

          io.in(pveKey).emit('updateStateSpecify', reducerPayload) // Roomのターンを更新
        }
        break
      }
      case 'cpuTurn': {
        /**
         * 本イベントはCPUターンになったタイミングで呼び出す
         * boardからユーザー情報を取得してCPU処理を実行していく
         */
        const { data } = payload
        const rule = validateRules['cpuTurn']
        if (!isCpuTurnEmitData(data, rule)) break
        
        cpuMainProcess({ io, adapterPubClient, data, pveKey })
        break
      }
      default: return {}
    }
    return {}
  })
}

export { cpuModeHandler }