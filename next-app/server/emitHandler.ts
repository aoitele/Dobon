import { Redis } from "ioredis";
import { Socket } from "socket.io";
import { reducerPayloadSpecify } from '../utils/game/roomStateReducer';
import { Emit } from '../@types/socket';
import { isEmitChat } from '../utils/function/useEmitDataType'

const emitHandler = (io:Socket, socket:any) => {
    const adapterPubClient:Redis = socket.adapter.pubClient;

    socket.on('emit', async (payload: Emit) => {
        console.log(payload,'payload')
        const { event, roomId, nickname } = payload
        const room = `room${payload.roomId}`
        const response = {}

        switch (event) {
            case 'join': {
                const usersKey = `room:${roomId}:users`
                const userCount = await adapterPubClient.scard(usersKey)
                if (userCount > 4) {
                    await adapterPubClient.del(usersKey) // eslint-disable-line no-await-in-loop
                }                            
                adapterPubClient.sadd(usersKey, String(nickname)) // Redisにユーザー追加
                const users = await adapterPubClient.smembers(usersKey)

                const userData = [];
                for (let i=1; i <= userCount; i+=1) {
                    userData.push({ id: i, nickname: users[i] || '', turn: i, score:0 })
                }

                // Game.board.usersにユーザーを追加
                let reducerPayload:reducerPayloadSpecify = {
                    'game': {
                        'board': {
                            'users': userData
                        },
                        'event': 'gamestart'
                    }
                }
                socket.broadcast.to(room).emit('updateStateSpecify', reducerPayload); // 送信者以外を更新

                // 送信者はgame.statusを更新させる
                reducerPayload = {
                    'game': {
                        'board': {
                            'users': userData
                        },
                        'status':'created'
                    }
                }
                socket.emit('updateStateSpecify', reducerPayload) // 送信者を更新
                return response
            }
            case 'gamestart': {
                console.log('gamestart')
                const deckKey = `room:${roomId}:deck`
                await adapterPubClient.sunionstore(deckKey, 'deck') // Redis copy deck for room

                // Assign userID to participants
                const socketList = await io.in(room).allSockets()
                const userCount = socketList.size

                // Redis sadd hands for users
                for (let i=1; i<=userCount; i+=1) {
                    const userHandsKey = `room:${payload.roomId}:user:${i}:hands`
                    console.log(userHandsKey,'userHandsKey add')
                    await adapterPubClient.del(userHandsKey) // eslint-disable-line no-await-in-loop
                    const hands = await adapterPubClient.spop(deckKey, 5) // eslint-disable-line no-await-in-loop
                    adapterPubClient.sadd(userHandsKey, hands)
                }

                const reducerPayload:reducerPayloadSpecify = {
                    'game': {
                        'event': 'gamestart'
                    }
                }
                io.in(room).emit('updateStateSpecify', reducerPayload) // Room全員のステータスを更新
                return response
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
                let message = '';

                if (isEmitChat(data)) { 
                    message = data.message
                }
                if (nickname && message) {
                    adapterPubClient.xadd('myStream', 'MAXLEN', '2', '*', 'user', nickname, 'message', message)
                }
                return response
            }
            default: return response
        }
    });
}

export default emitHandler