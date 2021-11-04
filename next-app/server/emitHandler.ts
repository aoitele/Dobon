import { Redis } from 'ioredis'
import { Socket } from 'socket.io'
import { reducerPayloadSpecify } from '../utils/game/roomStateReducer'
import { Emit } from '../@types/socket'
import { isEmitChat } from '../utils/function/useEmitDataType'
import { rowQuery } from '../prisma/prismaExec'
import { prisma, Prisma } from '../prisma'

const emitHandler = (io: Socket, socket: any) => {
  const adapterPubClient: Redis = socket.adapter.pubClient

  socket.on('emit', async (payload: Emit) => {
    console.log(payload, 'payload')
    const { event, roomId, userId, nickname } = payload
    const room = `room${payload.roomId}`

    switch (event) {
      case 'getUsers': {
        const usersKey = `room:${roomId}:users`
        const users = await adapterPubClient.smembers(usersKey)
        const userData = []
        for (let i = 1; i <= users.length; i += 1) {
          userData.push({ id: i, nickname: users[i-1], turn: i, score: 0 })
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
        const usersKey = `room:${roomId}:users`
        const userCount = await adapterPubClient.scard(usersKey)
        if (userCount > 4) {
          await adapterPubClient.del(usersKey) // eslint-disable-line no-await-in-loop
        }

        const userKey = `room:${roomId}:user${userId}`
        const redisUserId = await adapterPubClient.hmget(userKey, 'id')

        // Redisにユーザーデータがない場合、参加者をDBに保存
        if (!redisUserId) {
          const data:Prisma.ParticipantUncheckedCreateInput = {
            user_id: userId,
            room_id: roomId
          }
          await prisma.participant.create({data})
          // Redisにユーザーデータセット
          const userDataMini = [{ id: userId, nickname }]
          adapterPubClient.hmset(userKey, userDataMini)
        }
        const participants = await prisma.$queryRaw(rowQuery({ model: 'Participant', method: 'GameBoardUsersInit' })) // 参加者データ取得
                
        // Game.board.usersにユーザーを追加
        let reducerPayload: reducerPayloadSpecify = {
          game: {
            board: {
              users: participants
            },
            event: 'gamestart'
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
        break
      }
      case 'gamestart': {
        console.log('gamestart')
        const deckKey = `room:${roomId}:deck`
        await adapterPubClient.sunionstore(deckKey, 'deck') // Redis copy deck for room

        // Assign userID to participants
        const socketList = await io.in(room).allSockets()
        const userCount = socketList.size

        // Redis sadd hands for users
        for (let i = 1; i <= userCount; i += 1) {
          const userHandsKey = `room:${payload.roomId}:user:${i}:hands`
          console.log(userHandsKey, 'userHandsKey add')
          await adapterPubClient.del(userHandsKey) // eslint-disable-line no-await-in-loop
          const hands = await adapterPubClient.spop(deckKey, 5) // eslint-disable-line no-await-in-loop
          adapterPubClient.sadd(userHandsKey, hands)
        }

        const reducerPayload: reducerPayloadSpecify = {
          game: {
            event: 'gamestart'
          }
        }
        io.in(room).emit('updateStateSpecify', reducerPayload) // Room全員のステータスを更新
        break
      }
      case 'gethand': {
        // Const userHandsKey = `room:${payload.roomId}:user:${payload.userId}:hands`
        const userHandsKey = `room:3:user:0:hands`
        const hands = await adapterPubClient.smembers(userHandsKey)
        io.in(socket.id).emit('response', hands)
        return hands
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
