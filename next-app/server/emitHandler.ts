import { Redis } from "ioredis";
import { reducerPayload } from "../utils/game/roomStateReducer";

const emitHandler = (io:any, socket:any) => {
    const adapterPubClient:Redis = socket.adapter.pubClient;

    socket.on('emit', (payload: any) => {
        console.log(payload, 'payload');

        if (payload.event === 'chat') {
            const { message } = payload.data
            // Socket.to(payload.room).emit('message', message)
            adapterPubClient.xadd('myStream', 'MAXLEN', '2', '*', 'user', payload.nickname,'message', message)
        }

        if (payload.event === 'gamestart') {
            const state:reducerPayload = {
                game: {
                    id: payload.room,
                    status: 'playing'
                }
            }
            io.in(payload.room).emit('updateState', state)
        }
    });
}

export default emitHandler