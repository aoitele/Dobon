import { Redis } from 'ioredis'
import { Socket } from 'socket.io'
import { reducerPayloadSpecify } from '../utils/game/roomStateReducer'
import { Emit } from '../@types/socket'
import { isEmitChat } from '../utils/function/useEmitDataType'
import { rowQuery } from '../prisma/prismaExec'
import { prisma, Prisma } from '../prisma'
import { Player } from '../@types/game'

const emitHandler = (io: Socket, socket: any) => {
  const adapterPubClient: Redis = socket.adapter.pubClient

  socket.on('emit', async (payload: Emit) => {
    console.log(payload, 'payload')
    const { event, roomId, userId, nickname } = payload
    const room = `room${payload.roomId}`

    switch (event) {
      case 'getparticipants': {
        const usersKey = `room:${roomId}:users`
        const users = await adapterPubClient.smembers(usersKey)
        const userData = []
        console.log(users, 'test')
        for (let i = 0; i < users.length; i += 1) {
          userData.push({ id: 0, nickname: users[i] || 'no user', turn: 0, score: 0 })
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
        const participants:Player[] = await prisma.$queryRaw(
          rowQuery({
            model: 'Participant',
            method: 'GameBoardUsersInit',
            params: { roomId }
          })
        )
        console.log(participants, 'participants')
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
          console.log(userHandsKey, 'userHandsKey add')
          await adapterPubClient.del(userHandsKey) // eslint-disable-line no-await-in-loop
          const hands = await adapterPubClient.spop(deckKey, 5) // eslint-disable-line no-await-in-loop
          adapterPubClient.sadd(userHandsKey, hands)
        }

        const reducerPayload: reducerPayloadSpecify = {
          game: {
            id: 1,
            event: 'prepare',
          }
        }
        io.in(room).emit('updateStateSpecify', reducerPayload) // Room全員のステータスを更新
        break
      }
      case 'gethand': {
        const userHandsKey = `room:${payload.roomId}:user:${payload.userId}:hands`
        const allUserHandsKey = await adapterPubClient.keys(`room:${payload.roomId}:user:*`)
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
            let otherHand = await adapterPubClient.smembers(`room:${payload.roomId}:user:${uid}:hands`) // eslint-disable-line no-await-in-loop
            otherHand = otherHand.map(_ => re2.test(_) ? _ : 'z') // If not open card, OverWrite suit 'z'
            const data = { userId: Number(uid), hands: otherHand }
            otherHands.push(data)
          }
        }

        const hands = await adapterPubClient.smembers(userHandsKey)
        const reducerPayload: reducerPayloadSpecify = {
          game: {
            board: {
              hands,
              otherHands
            }
          }
        }
        io.in(socket.id).emit('updateStateSpecify', reducerPayload)
        break
      }
      case 'gamestart': {
        const deckKey = `room:${roomId}:deck`
        let initialTrash = await adapterPubClient.spop(deckKey, 1)
        initialTrash = [`${initialTrash[0]  }o`] // Open状態に
        const reducerPayload: reducerPayloadSpecify = {
          game: {
            status: 'playing',
            board: {
              turn: 1,
              trash: initialTrash
            }
          }
        }
        io.in(room).emit('updateStateSpecify', reducerPayload) // ゲーム開始、Room全員のステータスを更新
        break
      }
      case 'drawcard': {
        const deckKey = `room:${roomId}:deck`
        const userHandsKey = `room:${payload.roomId}:user:${payload.userId}:hands`
        const newCard = await adapterPubClient.spop(deckKey, 1)
        adapterPubClient.sadd(userHandsKey, newCard)
        const hands = await adapterPubClient.smembers(userHandsKey)
        // 送信者に手札を1枚追加した結果を返す
        const reducerPayload: reducerPayloadSpecify = {
          game: {
            board: {
              hands
            }
          }
        }
        socket.emit('updateStateSpecify', reducerPayload) // 送信者を更新
        break
      }
      case 'turnchange': {
        const { data } = payload
        if (data?.type === 'board') {
          const board = data.data
          const { users, turn } = board
          if (users && turn) {
            let nextTurn = turn + 1
            nextTurn = (nextTurn <= users.length) ? nextTurn : 1
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
        console.log(trash, 'trash')
        let reducerPayload: reducerPayloadSpecify = {
          game: {
            board: { 
              trash
            }
          }
        }
        io.in(room).emit('updateStateSpecify', reducerPayload) // Room全員の捨て札を更新

        // `${suit}${num}o`でデータがくるため、redisでoあり/なしでsrem
        const userHandsKey = `room:${payload.roomId}:user:${payload.userId}:hands`
        await adapterPubClient.srem(userHandsKey, trash[0], trash[0].slice(0, -1))

        // ルームメンバーに手札更新指令
        reducerPayload = {
          game: {
            event: 'gethand'
          }
        }
        io.in(room).emit('updateStateSpecify', reducerPayload)
        break
      }
      case 'chat': {
        const { data } = payload
        let message = ''

        if (isEmitChat(data)) {
          message = data.message
        }
        if (nickname && message) {
          adapterPubClient.xadd(
            'myStream',
            'MAXLEN',
            '2',
            '*',
            'user',
            nickname,
            'message',
            message
          )
        }
        break
      }
      default:
        return {}
    }
    return {}
  })
}

export default emitHandler
