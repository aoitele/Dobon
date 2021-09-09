import fastify from 'fastify'
import socketio from 'fastify-socket.io';

/**
 * Fastify http Server with WebSocket Plugin
 */
const FastifyInstance = fastify()

export const fastifyWithSocketIO = () => {
    console.log('registerPlugin...')
    FastifyInstance.addHook('onReady', () => {
        console.log('fastify server ready...')
    })
    
    FastifyInstance.register(socketio, {
        cors: {
            origin: process.env.NEXT_PUBLIC_SERVER_SOCKETIO_ALLOW_ORIGIN,
            methods: ["GET", "POST"]
        }
    })
    return FastifyInstance
}
