import { Redis } from "ioredis"
import { Socket } from 'socket.io'
import { Board, Effect, Player } from "../@types/game"
import { EmitForPVE } from "../@types/socket"
import { PVE_COM_USER_NAMES, PVE_UNREGISTERED_NAMES } from "../constant"
import { gameInitialState } from "../context/state/gameInitialState"
import { hasValidQueries, HasValidQueriesArgs } from "../utils/function/hasValidQueries"
import { sepalateSuitNum } from "../utils/game/checkHand"
import { cpuMainProcess } from "../utils/game/cpu/main"
import { getBonus } from "../utils/game/cpu/utils/getBonus"
import { isCpuLevelValue } from "../utils/game/cpu/utils/isCPULevelValue"
import { dobonJudge } from "../utils/game/dobonJudge"
// import { dobonJudge } from "../utils/game/dobonJudge"
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
            id: isFirstGame ? 1 : gameId,
            board: {
              ...gameInitialState.game.board, // 盤面ステートを初期化
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
            setCount: Number(query.setCount)
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
        const { trash, hands, effect } = board?.data ?? {}
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
        .srem(handsKey, trash.card.replace('p', '')) // `${suit}${num}p`でデータがくるため、redisはpなしでsrem
        .exec((_err, results) => results)

        const newHands = hands.filter(card => card !== trash.card)

        const reducerPayload: reducerPayloadSpecify = {
          game: {
            board: {
              trash: {...trash, card: `${trashCard.suit}${trashCard.num}o`},
              hands: newHands,
              effect,
            },
            event: action ? { action: action.data.effect, user: [user] } : undefined
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
      case 'drawcard__deckset': {
        /**
         * デッキ残枚数0の時にこのケースに入る
         * trashの最新1枚以外のカード情報を取得して新たな山札を生成
         * 生成後の山札から1枚を実行ユーザーの手札に加える
         */
        const prevHands = board?.data.hands // 返却する手札の順番を変化させないため盤面手札を取得しておく
        if (!board?.data || !prevHands?.length) break

        const [deckKey, trashKey, handsKey] = loadDobonRedisKeys([
          {mode:'pve', type: 'deck', firstKey: pveKey},
          {mode:'pve', type: 'trash', firstKey: pveKey },
          {mode:'pve', type: 'hands', firstKey: pveKey, secondKey: 'me'},
        ])

        const trashCard = await adapterPubClient.lrange(trashKey, 1, -1) // 最後の捨て札(先頭)を除くカードを取得

        adapterPubClient.pipeline()
        .sadd(deckKey, trashCard) // deckにtrashcardを戻す(順番はランダムに追加される)
        .ltrim(trashKey, 0, 0) // Trashは先頭だけ残す
        .exec((_err, results) => results)

        const newCard = await adapterPubClient.spop(deckKey, 1)
        adapterPubClient.sadd(handsKey, newCard)

        const deckCount = await adapterPubClient.scard(deckKey)
        const hands = [...prevHands, ...newCard]

        const reducerPayload: reducerPayloadSpecify = {
          game: {
            board: {
              hands,
              deckCount
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

        const rmPutableInfoHands = hands.map(hand => hand.replace('p', '')) // redisの手札情報にはpは入れない(oは入れる)

        adapterPubClient.pipeline()
          .del(handsKey)
          .sadd(handsKey, rmPutableInfoHands)
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
      case 'cpuDobon': {
        /**
         * カードが場に出た後、次のターンに移行する前に実施されるドボン判定。
         * 全CPUにドボンできるか（するか）を判断させる。
         */
        console.log(`\n--- DOBON CHECK START ---\n`)

        const trashCard = board?.data.trash?.card
        const trashUser = board?.data.trash?.user?.nickname
        if (!trashCard) return {}
        let [canCom1Dobon, canCom2Dobon, canCom3Dobon] = [false, false, false]

        const [handsKey_1, handsKey_2, handsKey_3] = loadDobonRedisKeys([
          {mode:'pve', type: 'hands', firstKey: pveKey, secondKey: 'com1' },
          {mode:'pve', type: 'hands', firstKey: pveKey, secondKey: 'com2' },
          {mode:'pve', type: 'hands', firstKey: pveKey, secondKey: 'com3' },
        ])

        adapterPubClient.pipeline()
        .smembers(handsKey_1)
        .smembers(handsKey_2)
        .smembers(handsKey_3)
        .exec((_err, results) => {
          (() => {
            const com1Hands = results[0][1]
            const com2Hands = results[1][1]
            const com3Hands = results[2][1]
            canCom1Dobon = trashUser !== 'com1' && dobonJudge(trashCard, com1Hands)
            canCom2Dobon = trashUser !== 'com2' && dobonJudge(trashCard, com2Hands)
            canCom3Dobon = trashUser !== 'com3' && dobonJudge(trashCard, com3Hands)
            console.log(trashCard, 'trashCard')

            console.log(`com1 - ${com1Hands} - ${canCom1Dobon}`)
            console.log(`com2 - ${com2Hands} - ${canCom2Dobon}`)
            console.log(`com3 - ${com3Hands} - ${canCom3Dobon}`)
            console.log(`\n--- DOBON CHECK END ---\n`)

            const dobonPlayer: Pick<Player, 'nickname'| 'turn'>[] = []
            canCom1Dobon && dobonPlayer.push({ nickname: 'com1', turn: 2 })
            canCom2Dobon && dobonPlayer.push({ nickname: 'com2', turn: 3 })
            canCom3Dobon && dobonPlayer.push({ nickname: 'com3', turn: 4 })
            console.log(dobonPlayer, 'dobonPlayer')

            // 判定結果でクライアント側の盤面状態を更新させる
            if (dobonPlayer.length) {
              // ドボンプレイヤーが出たらゲームを終了させる
              const reducerPayload: reducerPayloadSpecify = {
                game: {
                  event: {
                    user: dobonPlayer, action: 'dobon'
                  }
                }
              }
              console.log(reducerPayload, 'reducerPayload')
              io.in(pveKey).emit('updateStateSpecify', reducerPayload)
              return {}
            }

            // ドボンプレイヤーがいなければゲームを続行
            const reducerPayload = {
              game: {
                board: { allowDobon: false }
              }
            }
            io.in(pveKey).emit('updateStateSpecify', reducerPayload)
            return {}
          })()
        })
        break
      }
      case 'dobon': {
        if (!board?.data.trash?.card || !board.data.hands) break

        // 全ユーザーにドボン発生を通知
        let reducerPayload: reducerPayloadSpecify = {
          game: {
            event: {
              user: [user],
              action: 'dobon'
            }
          }
        }
        io.in(pveKey).emit('updateStateSpecify', reducerPayload)
        await sleep(1000)
        resetEvent(io, pveKey) // モーダル表示を終了させるためにクライアント側のstateを更新

        const lastTrashUser = board.data.trash.user
        // const judge = dobonJudge(board.data.trash.card, board.data.hands)
        const judge = true

        // ドボン成功ならユーザーデータのwiner/loserを更新させる
        const newUsersState = board.data.users?.map(u => {
          if (judge) {
            if (u.nickname === user?.nickname) { u.isWinner = true}
            if (u.nickname === lastTrashUser?.nickname) { u.isLoser = true }
          }
          return u
        })

        // ドボン結果を通知
        reducerPayload = {
          game: {
            event: {
              action: judge ? 'dobonsuccess' : 'dobonfailure'
            },
            board: {
              users: newUsersState,
            },
            result: {
              dobonHandsCount: board.data.hands.length
            }
          }
        }
        io.in(pveKey).emit('updateStateSpecify', reducerPayload)
        await sleep(1000)

        if (judge) {
          // ドボン成功ならスコア計算画面へ移行
          reducerPayload = {
            game: {
              status: 'ended'
            }
          }
          io.in(pveKey).emit('updateStateSpecify', reducerPayload)
          await sleep(1000)
        }
        resetEvent(io, pveKey)
        break
      }
      case 'getbonus': {
        const loadRedisKey = loadDobonRedisKeys([
          {mode:'pve', type: 'deck', firstKey: pveKey},
          {mode:'pve', type: 'trash', firstKey: pveKey},
        ])
        const [deckKey, trashKey] = loadRedisKey
        // ボーナスカードを取得
        const bonusCards = await getBonus(adapterPubClient, deckKey, trashKey)
        // スコアデータを更新
        // 結果をクライアントに通知
        console.log(bonusCards, 'bonusCard')
        let reducerPayload: reducerPayloadSpecify = {
          game: {
            board: {
              bonusCards
            }
          }
        }
        io.in(pveKey).emit('updateStateSpecify', reducerPayload)
        await sleep(3000)
        // 結果表示状態に移行させる
        reducerPayload = {
          game: {
            status: 'showScore'
          }
        }
        io.in(pveKey).emit('updateStateSpecify', reducerPayload)
        break
      }
      case 'postprocess': {
        /**
         * ゲーム終了時に行う処理を定義
         * - ユーザースコアの更新(data.users[]でスコアがくるのでredisを更新させる)
         */
        if (!board?.data.users?.length) break
        const { users } = board.data

        for (const u of users) {
          if (u.nickname && u.score) {
            const loadRedisKey = loadDobonRedisKeys([
              {mode:'pve', type: 'user', firstKey: pveKey, secondKey: u.nickname},
            ])
            const userKey = loadRedisKey[0]
            adapterPubClient.hset(userKey, 'score', u.score)
          }
        }
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