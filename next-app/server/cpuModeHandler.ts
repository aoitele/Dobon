import { Redis } from "ioredis"
import { Socket } from 'socket.io'
import { Board, Effect, Player } from "../@types/game"
import { EmitForPVE } from "../@types/socket"
import { PVE_COM_USER_NAMES, PVE_UNREGISTERED_NAMES } from "../constant"
import { gameInitialState } from "../context/state/gameInitialState"
import { hasValidQueries, HasValidQueriesArgs } from "../utils/function/hasValidQueries"
import { assertExists } from "../utils/function/nonNullable"
import { sepalateSuitNum } from "../utils/game/checkHand"
import { cpuMainProcess } from "../utils/game/cpu/cpuMainProcess"
import { checkDobonPlayers } from "../utils/game/cpu/utils/checkDobonPlayers"
import { getBonus } from "../utils/game/cpu/utils/getBonus"
import { isCpuLevelValue } from "../utils/game/cpu/utils/isCPULevelValue"
import { dobonJudge } from "../utils/game/dobonJudge"
import { existShouldBeSolvedEffect, resEffectName, resNewEffectState } from "../utils/game/effect"
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
          const isCpu = PVE_COM_USER_NAMES.includes(users[i])
          const mode = isCpu ? query?.[users[i]] : undefined

          // Hands initialize
          const nickname = isCpu ? users[i] : 'me'
          const redisKeys = loadDobonRedisKeys([
            {mode:'pve', type: 'hands', firstKey: pveKey, secondKey: nickname},
            {mode:'pve', type: 'user', firstKey: pveKey, secondKey: nickname},
          ])

          const hands = await redisHandsInit(adapterPubClient, deckKey, redisKeys[0]) // eslint-disable-line no-await-in-loop
          isCpu ? otherHands.push({ userId: 0, hands, nickname }) : myHands = hands

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

          userData.push({ id: 0, nickname: users[i], turn: i + 1, score, isWinner: false, isLoser: false, mode: (typeof mode === 'string' && isCpuLevelValue(mode)) ? mode : undefined, isCpu })
        }

        // Trash initialize
        const initialTrash = await redisTrashInit(adapterPubClient, deckKey, trashKey)
        const deckCount = await adapterPubClient.scard(deckKey)

        // 自分がドボンできるか判定
        const canIDobon = dobonJudge(initialTrash, myHands)

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
              waitDobon: canIDobon, // 自分のドボンチェックからゲームスタート
              status: 'playing',
              speed: board?.data.speed
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
        .then(async() => {
          const newHands = hands.filter(card => card !== trash.card).map(hand => hand.replace('p', '')) // 自分のターンが終わるため、putable状態を外す

          let reducerPayload: reducerPayloadSpecify = {
            game: {
              board: {
                trash: {...trash, card: `${trashCard.suit}${trashCard.num}o`},
                hands: newHands,
                effect,
                allowDobon: true,
              },
              event: action && user ? { user: [user], action: action.data.effect } : undefined
            }
          }
          io.in(pveKey).emit('updateStateSpecify', reducerPayload)

          if (effect) {
            await sleep(1000)
            resetEvent(io, pveKey) // モーダル表示を終了させるためにクライアント側のstateを更新
          }
          reducerPayload = { game: { board: { status: 'dobonCheck' } } }
          io.in(pveKey).emit('updateStateSpecify', reducerPayload)
        })
        break
      }
      case 'turnchange': {
        if (!board) break

        // 実行経路(putOut or actionBtn)により処理を分ける
        const byPutout = board.option?.triggered === 'putOut'
        const byActionBtn = board.option?.triggered === 'actionBtn'

        // ボードデータ取得
        const { users, turn, trash, effect } = board.data
        const selectedWildCard = board.option?.values.selectedWildCard ?? null
        let updatedEffect: Effect[] = effect ?? []

        if (users && turn && trash?.card) {
          // カードを出してターンが変更された場合のみeffectNameを取得する
          const effectName = byPutout ? resEffectName({ card: [trash.card], selectedWildCard }) : ''
          const isReversed = effect?.includes('reverse') ?? false // 盤面にターンリバース効果が発動中か
          const nextTurn = culcNextUserTurn(turn, users, effectName, isReversed)

          // カードを出してターンが変更された場合のみ場の効果を更新する
          if (byPutout) {
            updatedEffect = resNewEffectState(updatedEffect, effectName)
          }

          // 次がプレイヤーのターンで、もし解決すべき効果がある場合はstatus=effectResolvingを挟む
          const showAvoidEffectview = nextTurn === 1 && updatedEffect.length > 0 && existShouldBeSolvedEffect(updatedEffect)
          const boardStatus = showAvoidEffectview ? 'effectResolving' : 'playing'

          const reducerPayload: reducerPayloadSpecify = {
            game: {
              board: {
                turn: nextTurn,
                effect: updatedEffect,
                status: boardStatus,
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

        const loadRedisKey = loadDobonRedisKeys([
          {mode:'pve', type: 'deck', firstKey: pveKey},
          {mode:'pve', type: 'hands', firstKey: pveKey, secondKey: 'me' },
          {mode:'pve', type: 'trash', firstKey: pveKey },
        ])
        const [deckKey, handsKey, trashKey] = loadRedisKey

        const deckCountBefore = await adapterPubClient.scard(deckKey)
        const drawCardNum = Number(mat)
        const willDeckBeEmpty = deckCountBefore - drawCardNum <= 0

        let drawnCards:string[] = []

        if (willDeckBeEmpty) {
          // ドローによりデッキが0枚になる場合、デッキを再生成する
          const lastDeckCards = await adapterPubClient.spop(deckKey, deckCountBefore) // デッキに残っているカードを取得
          const trashCards = await adapterPubClient.lrange(trashKey, 1, -1) // 最後の捨て札(先頭)を除くカードを取得
          await adapterPubClient.sadd(deckKey, trashCards) // deckにtrashcardを戻す(順番はランダムに追加される)
          adapterPubClient.ltrim(trashKey, 0, 0) // Trashは先頭だけ残す
          const newCards = await adapterPubClient.spop(deckKey, drawCardNum - deckCountBefore)
          const adds = [...lastDeckCards, ...newCards]
          drawnCards = [...prevHands, ...adds]
          adapterPubClient.sadd(handsKey, adds)
        } else {
          // デッキが残る場合はカードを引いて追加するだけ
          const newCards = await adapterPubClient.spop(deckKey, drawCardNum)
          adapterPubClient.sadd(handsKey, newCards)
          drawnCards = [...prevHands, ...newCards]
        }

        const resolvedEffect = effectState.filter(state => state !== effect)
        const deckCount = await adapterPubClient.scard(deckKey)

        const reducerPayload: reducerPayloadSpecify = {
            game: {
              board: {
                hands: drawnCards,
                effect: resolvedEffect,
                deckCount,
                status: 'playing',
              },
              event: gameInitialState.game.event,
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
              effect: resolvedEffect,
              status: 'playing',
            },
            event: gameInitialState.game.event,
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
        
        cpuMainProcess({ io, adapterPubClient, data: board, pveKey, speed: board.data.speed })
        break
      }
      case 'cpuDobon': {
        /**
         * カードが場に出た後、次のターンに移行する前に実施されるドボン判定。
         * 全CPUにドボンできるか（するか）を判断させる。
         */
        console.log(`\n--- DOBON CHECK START ---\n`)

        const trashCard = board?.data.trash?.card
        const trashUser = board?.data.trash?.user
        const users = board?.data.users
        const hands = board?.data.hands
        assertExists(trashCard)
        assertExists(trashUser)
        assertExists(hands)
        assertExists(users)

        const [handsKey_1, handsKey_2, handsKey_3, handsKey_4] = loadDobonRedisKeys([
          {mode:'pve', type: 'hands', firstKey: pveKey, secondKey: 'com1' },
          {mode:'pve', type: 'hands', firstKey: pveKey, secondKey: 'com2' },
          {mode:'pve', type: 'hands', firstKey: pveKey, secondKey: 'com3' },
          {mode:'pve', type: 'hands', firstKey: pveKey, secondKey: 'me'   },
        ])

        adapterPubClient.pipeline()
        .smembers(handsKey_1)
        .smembers(handsKey_2)
        .smembers(handsKey_3)
        .smembers(handsKey_4)
        .exec((_err, results) => {
          (async() => {
            const { dobonPlayers, com1Hands, com2Hands, com3Hands, myHands } = checkDobonPlayers({ redisPipeLineResults: results, trashUser, trashCard, users })

            // 判定結果でクライアント側の盤面状態を更新させる
            if (dobonPlayers.length) {
              /**
               * ドボンプレイヤーが出たらゲームを終了させる
               * ドボンされた人がもし手札でドボンされた数値を作れる場合、ドボン返しとなる
               */
              let trashUserHands: string[] = trashUser.isCpu ? [] : myHands

              if (!trashUserHands.length) {
                trashUserHands =
                trashUser.nickname === 'com1' ? com1Hands :
                trashUser.nickname === 'com2' ? com2Hands :
                com3Hands
              }

              const isReverseDobon = dobonJudge(trashCard, trashUserHands)
              const dobonPlayersTurn = dobonPlayers.map(player => player.turn)
              const newUsersState = users.map(u => {
                u.turn && dobonPlayersTurn.includes(u.turn) && (u.isWinner = true)
                u.turn === trashUser.turn && (u.isLoser = true)
                return u
              })

              let reducerPayload: reducerPayloadSpecify = {
                game: {
                  event: {
                    user: dobonPlayers, action: 'dobon'
                  },
                  board: { users: newUsersState },
                  result: { dobonHandsCount: hands.length }
                }
              }
              io.in(pveKey).emit('updateStateSpecify', reducerPayload)

              await sleep(3000)
              resetEvent(io, pveKey) // モーダル表示を終了させるためにクライアント側のstateを更新

              if (isReverseDobon) {
              // ドボン返しの場合はwiner/loserが逆転する
              const updateUsersState = users.map(u => {
                if (u.turn && dobonPlayersTurn.includes(u.turn)) {
                  u.isWinner = false
                  u.isLoser = true
                }
                if (u.turn === trashUser.turn) {
                  u.isWinner = true
                  u.isLoser = false
                }
                return u
              })


                reducerPayload = {
                  game: {
                    event: {
                      user: [trashUser],
                      action: 'dobonreverse'
                    },
                    board: { users: updateUsersState },
                    result: { isReverseDobon: true },
                  }
                }
                io.in(pveKey).emit('updateStateSpecify', reducerPayload)
                await sleep(3000)
                resetEvent(io, pveKey) // モーダル表示を終了させるためにクライアント側のstateを更新
              }

              // スコア計算画面へ移行
              reducerPayload = { game: { status: 'ended' } }
              io.in(pveKey).emit('updateStateSpecify', reducerPayload)
              return {}
            }

            // ドボンプレイヤーがいなければゲームを続行
            const reducerPayload: reducerPayloadSpecify = {
              game: {
                board: {
                  status: 'turnChanging',
                }
              }
            }
            io.in(pveKey).emit('updateStateSpecify', reducerPayload)
            return {}
          })()
        })
        break
      }
      case 'dobon': {
        const { trash, hands, users } = board?.data ?? {}
        assertExists(user)
        assertExists(users)
        assertExists(hands)

        const trashUser = trash?.user
        const trashCard = trash?.card

        const [handsKey_1, handsKey_2, handsKey_3, handsKey_4] = loadDobonRedisKeys([
          {mode:'pve', type: 'hands', firstKey: pveKey, secondKey: 'com1' },
          {mode:'pve', type: 'hands', firstKey: pveKey, secondKey: 'com2' },
          {mode:'pve', type: 'hands', firstKey: pveKey, secondKey: 'com3' },
          {mode:'pve', type: 'hands', firstKey: pveKey, secondKey: 'me'   },
        ])
        adapterPubClient.pipeline()
        .smembers(handsKey_1)
        .smembers(handsKey_2)
        .smembers(handsKey_3)
        .smembers(handsKey_4)
        .exec((_err, redisPipeLineResults) => {
          (async() => {
            assertExists(trashUser)
            assertExists(trashCard)

            const { dobonPlayers, com1Hands, com2Hands, com3Hands } = checkDobonPlayers({ redisPipeLineResults, trashUser, trashCard, users })
            const dobonPlayersTurn = dobonPlayers.map(player => player.turn)
            const trashUserHands =
            trashUser.nickname === 'com1' ? com1Hands :
            trashUser.nickname === 'com2' ? com2Hands :
            com3Hands

            if (!dobonJudge(trashCard, hands)) return {} // UIでドボン可能な場合しか実行されないようにしているため実質この処理は起きえない

            // ドボン成功ならユーザーデータのwiner/loserを更新させる
            const newUsersState = users.map(u => {
              u.turn && dobonPlayersTurn.includes(u.turn) && (u.isWinner = true)
              u.turn === trashUser.turn && (u.isLoser = true)
              return u
            })

            let reducerPayload: reducerPayloadSpecify = {
              game: {
                event: {
                  user: dobonPlayers, action: 'dobon' // 自身と他のCPUの同時ドボンもありえるためuserを結合してeventに渡す
                },
                board: { users: newUsersState },
                result: { dobonHandsCount: hands.length }
              }
            }
            io.in(pveKey).emit('updateStateSpecify', reducerPayload)
            await sleep(3000)
            resetEvent(io, pveKey) // モーダル表示を終了させるためにクライアント側のstateを更新

            // もしドボンされた人がもし手札でドボンされた数値を作れる場合、ドボン返しとなる
            const isReverseDobon = dobonJudge(trashCard, trashUserHands)

            if (isReverseDobon) {
              const updateUsersState = users.map(u => {
                if (u.nickname === user?.nickname) {
                  u.isWinner = false
                  u.isLoser = true
                }
                if (u.nickname === trashUser.nickname) {
                  u.isLoser = false
                  u.isWinner = true
                }
                return u
              })
              reducerPayload = {
                game: {
                  event: {
                    user: [trashUser],
                    action: 'dobonreverse'
                  },
                  board: { users: updateUsersState },
                  result: { isReverseDobon: true },
                }
              }
              io.in(pveKey).emit('updateStateSpecify', reducerPayload)
              await sleep(3000)
            }

            // スコア計算画面へ移行
            reducerPayload = {
              game: {
                status: 'ended',
              }
            }
            io.in(pveKey).emit('updateStateSpecify', reducerPayload)
            await sleep(1000)
            resetEvent(io, pveKey)
            return {}
          })()
        })
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