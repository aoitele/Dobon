import { Redis } from "ioredis";
import { reducerPayload } from '../utils/game/roomStateReducer';
import { Emit } from '../@types/socket';
import { isEmitChat } from '../utils/function/useEmitDataType'

const emitHandler = (io:any, socket:any) => {
    const adapterPubClient:Redis = socket.adapter.pubClient;

    socket.on('emit', (payload: Emit): void => {
        console.log(payload, 'payload');
        const room = `room${payload.roomId}`

        switch (payload.event) {
            case 'gamestart': {
                const state:reducerPayload = {
                    game: {
                        id: payload.roomId,
                        status: 'playing'
                    }
                }
                // AdapterPubClient.sunionstore('room:1:deck', 'deck')
                io.in(room).emit('updateState', state)
                break;
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
                break;
            }
            default: break;
        }
    });
}

export default emitHandler