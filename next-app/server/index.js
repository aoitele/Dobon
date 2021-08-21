const next = require('next')
const fastify = require('fastify')()
const socketio = require('fastify-socket.io')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const host = '0.0.0.0'

const app = next({ dev })
const handle = app.getRequestHandler()

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
    return fastify // Pluginが登録されたfastify instanceを返す
}

app.prepare().then(async () => {
    const fastifyWithPlugin = await registerPlugin();

    fastifyWithPlugin.all('*', (req, res) => handle(req.raw, res.raw))
    
    fastifyWithPlugin.io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('chat message', (msg) => {
            console.log(`message: ${  msg}`);
        });
    });

    fastifyWithPlugin.listen(port, host, (err, address) => {
        if(err) throw err
        console.log(`Server listening at ${address}`)
    })
})
