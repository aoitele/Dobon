import { Redis } from "ioredis"
import { Socket } from 'socket.io'
import { Board, Effect, Player } from "../@types/game"
import { EmitForPVE } from "../@types/socket"
import { PartiallyRequired } from "../@types/utility"
import { PVE_COM_USER_NAMES, PVE_UNREGISTERED_NAMES } from "../constant"
import { hasValidQueries, HasValidQueriesArgs } from "../utils/function/hasValidQueries"
import { sepalateSuitNum } from "../utils/game/checkHand"
import { cpuMainProcess } from "../utils/game/cpu/main"
import { isCpuLevelValue } from "../utils/game/cpu/utils/isCPULevelValue"
import { isAddableEffect, resEffectName, resNewEffectState } from "../utils/game/effect"
import { reducerPayloadSpecify } from "../utils/game/roomStateReducer"
import sleep from "../utils/game/sleep"
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
    const { event, gameId, user, data } = payload
    const { board, action } = data ?? {}

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

          const hands = await redisHandsInit(adapterPubClient, deckKey, redisKeys[0]) // eslint-disable-line no-await-in-loop
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
        const prevHands = board?.data.hands // 返却する手札の順番を変化させないため盤面手札を取得しておく
        if (!board?.data || !prevHands?.length) break

        const loadRedisKey = loadDobonRedisKeys([
          {mode:'pve', type: 'deck', firstKey: pveKey},
          {mode:'pve', type: 'hands', firstKey: pveKey, secondKey: 'me' },
        ])
        const deckKey = loadRedisKey[0]
        const handsKey = loadRedisKey[1]
        const newCard = await adapterPubClient.spop(deckKey, 1)
        adapterPubClient.sadd(handsKey, newCard)
        const deckCount = await adapterPubClient.scard(deckKey)
        const hands = [...prevHands, ...newCard]

        // 手札を更新
        const reducerPayload: reducerPayloadSpecify = {
          game: {
            board: {
              hands,
              deckCount,
            }
          }
        }
        socket.emit('updateStateSpecify', reducerPayload)
        break
      }
      case 'playcard': {
        const { trash, hands } = board?.data ?? {}
        if (!trash || !trash.card || !hands) break

        const loadRedisKey = loadDobonRedisKeys([
          {mode:'pve', type: 'trash', firstKey: pveKey},
          {mode:'pve', type: 'hands', firstKey: pveKey, secondKey: 'me' },
        ])
        const trashKey = loadRedisKey[0]
        const handsKey = loadRedisKey[1]

        const trashCard = sepalateSuitNum([trash.card])[0]

        adapterPubClient.pipeline()
        .lpush(trashKey, `${trashCard.suit}${trashCard.num}`) // 最新の捨て札を先頭に追加(trashは`suit+num`形式で追加する)
        .srem(handsKey, trash.card)
        .exec((_err, results) => results)

        const newHands = hands.filter(card => card !== trash.card)

        const reducerPayload: PartiallyRequired<reducerPayloadSpecify, 'game'> = {
          game: {
            board: { 
              trash: {...trash, card: `${trashCard.suit}${trashCard.num}o`},
              allowDobon: true,
              hands: newHands,
            },
            event: action ? { action: action.data.effect, user } : undefined
          }
        }

        io.in(pveKey).emit('updateStateSpecify', reducerPayload) // Room全員の捨て札を更新
        await sleep(1000)
        resetEvent(io, pveKey) // モーダル表示を終了させるためにクライアント側のstateを更新
        break
      }
      case 'turnchange': {
        if (!board) break

        // 実行経路(putOut or actionBtn)により処理を分ける
        const byPutout = board.option?.triggered === 'putOut'
        const byActionBtn = board.option?.triggered === 'actionBtn'

        // ボードデータ取得、連続した自分のターンかどうかの判定(=skip効果によるturnchange?)
        const { users, turn, trash, effect } = board.data
        const isMyTurnConsecutive = board.option?.values.isMyTurnConsecutive
        let updatedEffect: Effect[] = []

        if (users && turn && trash?.card) {
          // Skipカード効果で得た自分の連続ターンでない、純粋に自分のターンが来てカードを出した場合のみeffectNameを取得する
          const effectName = (!isMyTurnConsecutive && byPutout) ? resEffectName({ card: [trash.card], selectedWildCard: null }) : ''
          const isReversed = (typeof effect !== 'undefined') && effect.includes('reverse')
          const nextTurn = culcNextUserTurn(turn, users, effectName, isReversed)

          if (effect && effectName && isAddableEffect(effectName)) {
            updatedEffect = resNewEffectState(effect, effectName)
          }

          const reducerPayload: reducerPayloadSpecify = {
            game: {
              board: {
                turn: nextTurn,
                effect: updatedEffect.length ? updatedEffect : undefined,
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
      case 'drawcard__effect': {
        // 本イベントはdraw effectを受けた場合に呼び出す
        const prevHands = board?.data.hands // 返却する手札の順番を変化させないため盤面手札を取得しておく
        if (!action || !prevHands?.length) break

        const { effectState, effect } = action.data
        const mat = effect.match(/[0-9]/u)
        if (mat === null) break

        const drawCardNum = Number(mat)
        const loadRedisKey = loadDobonRedisKeys([
          {mode:'pve', type: 'deck', firstKey: pveKey},
          {mode:'pve', type: 'hands', firstKey: pveKey, secondKey: 'me' },
        ])
        const [deckKey, handsKey] = loadRedisKey

        const newCard = await adapterPubClient.spop(deckKey, drawCardNum)
        adapterPubClient.sadd(handsKey, newCard)

        const newHands = [...prevHands, ...newCard]
        const resolvedEffect = effectState.filter(state => state !== effect)
        const deckCount = await adapterPubClient.scard(deckKey)

        const reducerPayload: reducerPayloadSpecify = {
            game: {
              board: {
                hands: newHands,
                effect: resolvedEffect,
                deckCount,
              }
            }
          }
        io.in(pveKey).emit('updateStateSpecify', reducerPayload)
        break
      }
      case 'opencard': {
        // 本イベントはopencard effectを受けた場合に呼び出す
        const prevHands = board?.data.hands // 返却する手札の順番を変化させないため盤面手札を取得しておく
        if (!action || !prevHands?.length) break

        const { effectState, effect } = action.data
        const loadRedisKey = loadDobonRedisKeys([
          {mode:'pve', type: 'hands', firstKey: pveKey, secondKey: 'me' },
        ])
        const [handsKey] = loadRedisKey
        /**
         * 盤面手札は下記のパターンで送られる
         * s1   出せない手札
         * s1p  出せる手札
         * s1o  既に公開状態の手札、出せない
         * s1op 既に公開状態の手札、出せる
        */
        const re = /[a-z][0-9]+o/gu
        const hands = prevHands.map(card => {
          const mat = card.match(re)
          if (mat) return card // 既に公開状態であればそのまま返す
          return card.includes('p') ? `${card.replace('p', 'op')}` : `${card}o` // 出せるカードであればopを付加して返す
        })

        adapterPubClient.pipeline()
          .del(handsKey)
          .sadd(handsKey, hands)
          .exec((_err, results) => results)

        const resolvedEffect = effectState.filter(state => state !== effect)
        const reducerPayload: reducerPayloadSpecify = {
          game: {
            board: {
              hands,
              effect: resolvedEffect
            }
          }
        }
        io.in(pveKey).emit('updateStateSpecify', reducerPayload)
        break
      }
      case 'cpuTurn': {
        /**
         * 本イベントはCPUターンになったタイミングで呼び出す
         * boardからユーザー情報を取得してCPU処理を実行していく
         */
        const rule = validateRules.cpuTurn
        if (!board || !isCpuTurnEmitData(board, rule)) break
        
        cpuMainProcess({ io, adapterPubClient, data: board, pveKey })
        break
      }
      default: return {}
    }
    return {}
  })
}

const resetEvent = (io:Socket, pveKey:string) => {
  const reducerPayload: reducerPayloadSpecify = {
    game: {
      event: initialState.game?.event
    }
  }
  io.in(pveKey).emit('updateStateSpecify', reducerPayload)
}

export { cpuModeHandler, resetEvent }