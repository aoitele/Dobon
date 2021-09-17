import next from 'next'
import { createAdapter } from 'socket.io-redis';
import { fastifyWithSocketIO } from './fastifyWithSocketIO';
import { pubClient, subClient } from './redisClient';
import emitHandler from './emitHandler';

const port = process.env.PORT || 3000
const host = '0.0.0.0'
const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(async () => {
    const fastify = await fastifyWithSocketIO();
    const io = fastify.io
    
    fastify.all('*', (req: any, res: any) => handle(req.raw, res.raw))
    fastify.io.on('connection', (socket: any) => {
        const { room } = socket.handshake.query;
        if (room) {
            socket.join(room)
            fastify.io.in(room).emit('hello', 'new user comming!!')
            emitHandler(io, socket)   
        }
        // Await adapterPubClient.xread("block", 0, "STREAMS", "myStream", 0);
    });

    fastify.io.adapter(createAdapter({ pubClient, subClient }));

    fastify.io.of("/").adapter.on("join-room", (room: any, id: any) => {
        console.log(`socket ${id} has joined room ${room}`);
    });

    fastify.listen(port, host, (err: any, address: any) => {
        if(err) throw err
        console.log(`Server listening at ${address}`)
    })
})
