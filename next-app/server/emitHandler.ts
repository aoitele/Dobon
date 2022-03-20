import { Redis } from 'ioredis'
import { Socket } from 'socket.io'
import { reducerPayloadSpecify } from '../utils/game/roomStateReducer'
import { Emit } from '../@types/socket'
import { isEmitAction } from '../utils/function/useEmitDataType'
import { rowQuery } from '../prisma/prismaExec'
import { prisma, Prisma } from '../prisma'
import { Effect, Player } from '../@types/game'
import { dobonJudge } from '../utils/game/dobonJudge'
import sleep from '../utils/game/sleep'
import { resEffectName } from '../utils/game/effect'
import { culcNextUserTurn } from '../utils/game/turnInfo'
import { initialState } from '../utils/game/state'

const emitHandler = (io: Socket, socket: any) => {
  const adapterPubClient: Redis = socket.adapter.pubClient
  
  socket.on('emit', async (payload: Emit) => {
    if (prisma === null) { return {} }  
    console.log(payload, 'payload')
    const { event, roomId, user, userId, nickname } = payload
    const room = `room${roomId}`

    switch (event) {
      case 'getparticipants': {
        const usersKey = `room:${roomId}:users`
        const users = await adapterPubClient.smembers(usersKey)
        const userData:Player[] = []
        for (let i = 0; i < users.length; i += 1) {
          userData.push({ id: 0, nickname: users[i] || 'no user', turn: 0, score: 0, isWinner: false, isLoser: false })
        }
        const reducerPayload: reducerPayloadSpecify = {
          game: {
            board: {
              users: userData
            }
          }
        }
        socket.emit('updateStateSpecify', reducerPayload) // 送信者を更新
        break;
      }
      case 'join': {
        if (!roomId || !userId || !nickname) return {}
        const userKey = `room:${roomId}:user:${userId}`
        const redisUserId = await adapterPubClient.hmget(userKey, 'id')
        // Redisにユーザーデータがない場合、参加者をDBに保存
        if (redisUserId[0] === null) {
          const data:Prisma.ParticipantUncheckedCreateInput = {
            user_id: userId,
            room_id: roomId
          }
          try {
            await prisma.participant.create({ data })
            // Redisにユーザーデータセット
            const userDataMini = [{ id: userId, nickname }]
            await adapterPubClient.hmset(userKey, userDataMini)
          } catch(e) {
            console.log(e,'e')
          }
        }
        // 参加者データ取得
        let participants:Player[] = await prisma.$queryRaw(
          rowQuery({
            model: 'Participant',
            method: 'GameBoardUsersInit',
            params: { roomId }
          })
        )
        // IsWinner, isLoserの初期値を付与
        const mergeObj = { isWinner:false, isLoser:false }
        participants = participants.map(_ => {
          return { ..._, ...mergeObj }
        })
        // Game.board.usersにユーザーを追加
        let reducerPayload: reducerPayloadSpecify = {
          game: {
            board: {
              users: participants
            }
            // Event: 'gamestart'
          }
        }
        socket.broadcast.to(room).emit('updateStateSpecify', reducerPayload) // 送信者以外を更新

        // 送信者はgame.statusをcreatedに
        reducerPayload = {
          game: {
            board: {
              users: participants
            },
            status: 'created'
          }
        }
        socket.emit('updateStateSpecify', reducerPayload) // 送信者を更新

        // Redisに保存しているルーム参加者を更新する(ユーザー名表示のみに使うためnickname配列で保存)
        const usersKey = `room:${roomId}:users`
        await adapterPubClient.del(usersKey)
        if (participants.length) {
          const nicknameArray = participants.map(_ => _.nickname)
          await adapterPubClient.sadd(usersKey, nicknameArray)
        }
        break
      }
      case 'prepare': {
        const deckKey = `room:${roomId}:deck`
        await adapterPubClient.sunionstore(deckKey, 'deck') // Redis copy deck for room

        // Get participants data
        const participants:Player[] = await prisma.$queryRaw(rowQuery({
            model: 'Participant',
            method: 'GameBoardUsersInit',
            params: { roomId }
          })
        )
        // Redis sadd hands for users
        for (let i=0; i<participants.length; i+=1) {
          const userHandsKey = `room:${payload.roomId}:user:${participants[i].id}:hands`
          await adapterPubClient.del(userHandsKey) // eslint-disable-line no-await-in-loop
          const hands = await adapterPubClient.spop(deckKey, 5) // eslint-disable-line no-await-in-loop
          adapterPubClient.sadd(userHandsKey, hands)
        }

        const reducerPayload: reducerPayloadSpecify = {
          game: {
            id: 1,
            event: {
              action: 'preparecomplete'
            },
          }
        }
        io.in(room).emit('updateStateSpecify', reducerPayload) // Room全員のステータスを更新
        break
      }
      case 'gethand': {
        const userHandsKey = `room:${roomId}:user:${userId}:hands`
        const allUserHandsKey = await adapterPubClient.keys(`room:${roomId}:user:*:hands`)
        const otherHandsKey = allUserHandsKey.filter(_=>_ !== userHandsKey)
        const re = /user:([0-9]+)/gu
        const re2 = /[a-z][0-9]+o/gu
        const otherHands = []

        for (let i=0; i < otherHandsKey.length; i+=1) {
          let search = null
          search = re.exec(otherHandsKey[i])
          re.lastIndex = 0;  // Reset pointer index
          const uid = search ? search[1] : null
          if (uid) {
            let otherHand = await adapterPubClient.smembers(`room:${roomId}:user:${uid}:hands`) // eslint-disable-line no-await-in-loop
            otherHand = otherHand.map(_ => {
              re2.lastIndex = 0;  // Reset pointer index
              return re2.test(_) ? _ : 'z'
            }) // If not open card, OverWrite suit 'z'
            const data = { userId: Number(uid), hands: otherHand }
            otherHands.push(data)
          }
        }
        const hands = await adapterPubClient.smembers(userHandsKey)
        const deckKey = `room:${roomId}:deck`
        const deckCount = await adapterPubClient.scard(deckKey)

        const reducerPayload: reducerPayloadSpecify = {
          game: {
            board: {
              hands,
              otherHands,
              deckCount
            }
          }
        }
        io.in(socket.id).emit('updateStateSpecify', reducerPayload)
        break
      }
      case 'gamestart': {
        const deckKey = `room:${roomId}:deck`
        const trashKey = `room:${roomId}:trash`
        await adapterPubClient.del(trashKey) // Trash初期化

        const trash = await adapterPubClient.spop(deckKey, 1)
        await adapterPubClient.lpush(trashKey, trash)
        const initialTrash = `${trash[0]}o` // フロント返却時はOpen状態にする
        const deckCount = await adapterPubClient.scard(deckKey)
        const reducerPayload: reducerPayloadSpecify = {
          game: {
            status: 'playing',
            board: {
              turn: 1,
              trash: {
                card: initialTrash
              },
              deckCount,
              effect: []
            }
          }
        }
        io.in(room).emit('updateStateSpecify', reducerPayload) // ゲーム開始、Room全員のステータスを更新
        break
      }
      case 'drawcard': {
        const deckKey = `room:${roomId}:deck`
        const userHandsKey = `room:${roomId}:user:${userId}:hands`
        const newCard = await adapterPubClient.spop(deckKey, 1)
        await adapterPubClient.sadd(userHandsKey, newCard)
        // ルームメンバーに手札更新指令
        const reducerPayload: reducerPayloadSpecify = {
          game: {
            event: {
              action: 'gethand'
            }
          }
        }
        io.in(room).emit('updateStateSpecify', reducerPayload)
        break
      }
      case 'drawcard__duetoeffect': {
        const { data } = payload
        if (!isEmitAction(data)) return {}

        const { effectState, effect } = data.data
        const mat = effect.match(/[0-9]/u)

        if (mat !== null) {
          const drawCardNum = Number(mat)
          console.log(drawCardNum, 'drawCardNum')
          const deckKey = `room:${roomId}:deck`
          const userHandsKey = `room:${roomId}:user:${userId}:hands`
          const newCard = await adapterPubClient.spop(deckKey, drawCardNum)
          await adapterPubClient.sadd(userHandsKey, newCard)
          // ルームメンバーに手札更新指令
          const reducerPayload: reducerPayloadSpecify = {
            game: {
              event: {
                action: 'gethand'
              }
            }
          }
          io.in(room).emit('updateStateSpecify', reducerPayload)
        }
        await sleep(1000)
        resolveEffect(io, room, effectState, effect) // 全クライアントのboardState.effectを更新
        break
      }
      case 'drawcard__deckset': {
        /**
         * デッキ残枚数0の時にこのケースに入る
         * trashの最新1枚以外のカード情報を取得して新たな山札を生成
         * 生成後の山札から1枚を実行ユーザーの手札に加える
         */
        const deckKey = `room:${roomId}:deck`
        const trashKey = `room:${roomId}:trash`

        const trashCard = await adapterPubClient.lrange(trashKey, 1, -1) // 最後の捨て札(先頭)を除くカードを取得
        await adapterPubClient.sadd(deckKey, trashCard)
        await adapterPubClient.ltrim(trashKey, 0, 0) // Trashは先頭だけ残す

        const userHandsKey = `room:${roomId}:user:${userId}:hands`
        const newCard = await adapterPubClient.spop(deckKey, 1)
        await adapterPubClient.sadd(userHandsKey, newCard)

        const deckCount = await adapterPubClient.scard(deckKey)

        // ルームメンバーに手札更新指令、山札も更新
        const reducerPayload: reducerPayloadSpecify = {
          game: {
            event: {
              action: 'gethand'
            },
            board: {
              deckCount
            }
          }
        }
        io.in(room).emit('updateStateSpecify', reducerPayload)
        break
      }
      case 'turnchange': {
        const { data } = payload
        if (data?.type === 'board') {
          const board = data.data
          const { users, turn, trash, effect } = board
          const isMyTurnConsecutive = data.option?.values.isMyTurnConsecutive
          const triggered = data.option?.triggered
          if (users && turn && trash?.card) {
            // Skipカード効果で得た自分の連続ターンでない、純粋に自分のターンが来てカードを出した場合のみeffectNameを取得する
            const effectName = (!isMyTurnConsecutive || triggered === 'putOut') ? resEffectName({ card: [trash.card], selectedWildCard: null }) : ''
            const isReversed = (typeof effect !== 'undefined') && effect.includes('reverse')
            const nextTurn = culcNextUserTurn(turn, users, effectName, isReversed) 
            const reducerPayload: reducerPayloadSpecify = {
              game: {
                board: {
                  turn: nextTurn,
                }
              }
            }
            io.in(room).emit('updateStateSpecify', reducerPayload) // Roomのターンを更新
          }
        }
        break
      }
      case 'playcard': {
        const { data } = payload
        if (data?.type !== 'board' || typeof data.data.trash === 'undefined') break

        const { trash } = data.data
        if (trash.card === '' || !trash.user || typeof trash.card === 'undefined') break
        const { card } = trash

        const trashKey = `room:${roomId}:trash`
        // `${suit}${num}o`でデータがくるため、redisはoなしでlpush
        const trashCard = card.replace('o', '')
        await adapterPubClient.lpush(trashKey, trashCard) // 最新の捨て札を先頭に追加

        let reducerPayload: reducerPayloadSpecify = {
          game: {
            board: { 
              trash
            }
          }
        }
        io.in(room).emit('updateStateSpecify', reducerPayload) // Room全員の捨て札を更新

        // `${suit}${num}o`でデータがくるため、redisはoあり/なしでsrem
        const userHandsKey = `room:${payload.roomId}:user:${payload.userId}:hands`
        await adapterPubClient.srem(userHandsKey, card, card.slice(0, -1))

        // ルームメンバーに手札更新指令
        reducerPayload = {
          game: {
            event: {
              action: 'gethand'
            }
          }
        }
        io.in(room).emit('updateStateSpecify', reducerPayload)
        break
      }
      case 'effectcard': {
        /**
         * カード効果を全員に表示するため
         * event.action 更新を行う
         */
        const { data } = payload
        if (data?.type !== 'action' || !user) break
        const action = data.data.effect
        const { turn } = user
        const reducerPayload:reducerPayloadSpecify = {
          game: {
            event: {
              action,
              user: { nickname:user.nickname, turn }
            }
          }
        }
        io.in(room).emit('updateStateSpecify', reducerPayload)
        await sleep(1000)
        resetEvent(io, room) // モーダル表示を終了させるためにクライアント側のstateを更新
        break
      }
      case 'effectupdate': {
        /**
         * BoardState.effectの更新
         */
        const { data } = payload
        if (data?.type !== 'board') break
        const { effect } = data.data
        const reducerPayload:reducerPayloadSpecify = {
          game: { board: { effect } }
        }
        io.in(room).emit('updateStateSpecify', reducerPayload)
        break
      }
      case 'opencard': {
        const { data } = payload
        if (!isEmitAction(data)) return {}
        const { effectState, effect } = data.data

        // Redis user:{id}:handsを全てオープン状態に書き換え
        const userHandsKey = `room:${roomId}:user:${userId}:hands`
        let hands = await adapterPubClient.smembers(userHandsKey)
        const re = /[a-z][0-9]+o/gu
        hands = hands.map(_ => _.match(re) ? _ : `${_}o`)
        await adapterPubClient.del(userHandsKey)
        await adapterPubClient.sadd(userHandsKey, hands)
        // ルームメンバーに手札更新指令
        const reducerPayload:reducerPayloadSpecify = {
          game: {
            event: {
              action: 'gethand'
            }
          }
        }
        io.in(room).emit('updateStateSpecify', reducerPayload)
        await sleep(1000)
        resolveEffect(io, room, effectState, effect) // 全クライアントのboardState.effectを更新
        break
      }
      case 'dobon': {
        const { data } = payload
        if (data?.type !== 'board') break

        const boardState = data.data
        if (!user || typeof boardState.trash === 'undefined' || !boardState.trash.card || typeof boardState.hands === 'undefined' || !boardState.users) break
        // 全ユーザーにドボン発生を通知
        let reducerPayload: reducerPayloadSpecify = {
          game: {
            event: {
              user,
              action: 'dobon'
            }
          }
        }
        io.in(room).emit('updateStateSpecify', reducerPayload)
        await sleep(3000)

        // 数字のみ抜き取り計算に利用する
        const re = /[0-9]+/gui
        const trashCard = Number(boardState.trash.card.match(re))
        const lastTrashUser = boardState.trash.user
        const hand = boardState.hands.flatMap(_ => Number(_.match(re)))
        const judge = dobonJudge(trashCard, hand)
        // Const judge = true

        // ドボン成功ならユーザーデータのwiner/loserを更新させる
        const newUsersState = boardState.users.map(u => {
          if(judge) {
            if (u.id === user.id) { u.isWinner = true}
            if (u.id === lastTrashUser?.id) { u.isLoser = true }
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
              users: newUsersState
            }
          }
        }
        io.in(room).emit('updateStateSpecify', reducerPayload)
        await sleep(3000)

        if (judge) {
          // ドボン成功ならスコア計算画面へ移行
          reducerPayload = {
            game: {
              status: 'ended'
            }
          }
          io.in(room).emit('updateStateSpecify', reducerPayload)
          await sleep(3000)
        }
        resetEvent(io, room)
        break
      }
      default:
        return {}
    }
    return {}
  })
}

const resetEvent = (io:Socket, room:string) => {
  const reducerPayload: reducerPayloadSpecify = {
    game: {
      event: initialState.game?.event
    }
  }
  io.in(room).emit('updateStateSpecify', reducerPayload)
}

const resolveEffect = (io:Socket, room:string, effectState:Effect[], effect:Effect) => {
  const newEffectState = effectState.filter(_ => _ !== effect)
  const reducerPayload: reducerPayloadSpecify = {
    game: {
      board: {
        effect: newEffectState
      }
    }
  }
  io.in(room).emit('updateStateSpecify', reducerPayload)
}

export default emitHandler
