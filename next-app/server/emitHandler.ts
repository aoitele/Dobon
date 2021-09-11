import { Redis } from "ioredis";

const emitHandler = (socket:any) => {
    const adapterPubClient:Redis = socket.adapter.pubClient;

    socket.on('emit', (payload: any) => {
        console.log(payload, 'payload');

        if (payload.event === 'chat') {
            const { message } = payload.data
            // Socket.to(payload.room).emit('message', message)
            adapterPubClient.xadd('myStream', 'MAXLEN', '2', '*', 'user', payload.nickname,'message', message)
        }

        if (payload.event === 'gamestart') {
            socket.to(payload.room).emit('message', 'gamestart!!')
        }
    });
}

export default emitHandler