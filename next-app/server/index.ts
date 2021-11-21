import next from 'next'
import { createAdapter } from 'socket.io-redis'
import { fastifyWithSocketIO } from './fastifyWithSocketIO'
import { pubClient, subClient, initData } from './redisClient'
import emitHandler from './emitHandler'
import { join } from 'path'
const url = require('url');

const port = process.env.PORT || 3000
const host = '0.0.0.0'
const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(async () => {
  const fastify = await fastifyWithSocketIO()
  const io = fastify.io
  
  // For PWA Static Resources
  fastify.get('/sw.js' || /^\/(workbox|worker|fallback)-\w+\.js$/u, (req: any, res: any) => {
    const { pathname } = url.parse(req.url, true)
    const filePath = join(__dirname, '.next', pathname)
    app.serveStatic(req, res, filePath)
  })
  
  fastify.all('*', (req: any, res: any) => handle(req.raw, res.raw))
  fastify.io.on('connection', (socket: any) => {
    const { roomId } = socket.handshake.query
    if (roomId) {
      const room = `room${roomId}`
      socket.join(room)
      fastify.io.in(room).emit('hello', 'new user comming!!')
      emitHandler(io, socket)
    }
    // Await adapterPubClient.xread("block", 0, "STREAMS", "myStream", 0);
  })

  fastify.io.adapter(createAdapter({ pubClient, subClient }))

  fastify.io.of('/').adapter.on('join-room', (room: any, id: any) => {
    console.log(`socket ${id} has joined room ${room}`)
  })

  fastify.listen(port, host, (err: any, address: any) => {
    if (err) throw err
    console.log(`Server listening at ${address}`)
  })
  initData()
})
