import { Redis } from "ioredis";
import { Socket } from "socket.io";
import { reducerPayload } from '../utils/game/roomStateReducer';
import { Emit } from '../@types/socket';
import { isEmitChat } from '../utils/function/useEmitDataType'

const initialState:reducerPayload = {
    roomId: null,
    game: {
        id: null,
        status: undefined,
        event: null,
        board: {
            users:[],
            deck:[],
            hands:[],
            trash:[]
        }
    }
}

const emitHandler = (io:Socket, socket:any) => {
    const adapterPubClient:Redis = socket.adapter.pubClient;

    socket.on('emit', async (payload: Emit) => {
        console.log(payload, 'payload');
        const { event, gameId, roomId } = payload
        const room = `room${payload.roomId}`
        const response = {}

        switch (event) {
            case 'gamestart': {           
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

                const state = { 
                    ...initialState,
                    roomId,
                    game: {
                        ...initialState.game,
                        id: gameId || 1,
                        status:'playing'
                    }
                }
                io.in(room).emit('updateState', state)
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
                const { nickname, data } = payload
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