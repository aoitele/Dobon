const next = require('next')
const fastify = require('fastify')()
const socketio = require('fastify-socket.io')
const { createAdapter } = require('socket.io-redis')
const { createClient } = require('redis')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const host = '0.0.0.0'

const app = next({ dev })
const handle = app.getRequestHandler()

const redisClientOpts = dev ? { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) } : process.env.REDIS_URL
const pubClient = createClient(redisClientOpts)
const subClient = pubClient.duplicate();

/**
 * Fastify http Server with WebSocket Plugin
 */
const registerPlugin = () => {
    console.log('registerPlugin...')
    fastify.addHook('onReady', () => {
        console.log('fastify server ready...')
    })
    
    fastify.register(socketio, {
        cors: {
            origin: process.env.NEXT_PUBLIC_SERVER_SOCKETIO_ALLOW_ORIGIN,
            methods: ["GET", "POST"]
        }
    })
    return fastify
}

app.prepare().then(async () => {
    const fastifyWithPlugin = await registerPlugin();

    fastifyWithPlugin.all('*', (req, res) => handle(req.raw, res.raw))
    fastifyWithPlugin.io.on('connection', (socket) => {
        const { room } = socket.handshake.query;
        socket.join(room)
        socket.to(room).emit('hello', 'new user comming!!')

        socket.on('emit', (payload) => {
            console.log(payload, 'payload');

            if (payload.event === 'chat') {
                const { message } = payload.data
                socket.to(payload.room).emit('message', message)
            }
        });
    });

    fastifyWithPlugin.io.of("/").adapter.on("join-room", (room, id) => {
        console.log(`socket ${id} has joined room ${room}`);
    });
    fastifyWithPlugin.io.adapter(createAdapter({ pubClient, subClient }));

    fastifyWithPlugin.listen(port, host, (err, address) => {
        if(err) throw err
        console.log(`Server listening at ${address}`)
    })
})
