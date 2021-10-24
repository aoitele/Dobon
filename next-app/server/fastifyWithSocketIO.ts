import fastify from 'fastify'
import socketio from 'fastify-socket.io'

/**
 * Fastify http Server with WebSocket Plugin
 */
const FastifyInstance = fastify()
const noOpParser = async (req: any, payload: any) => payload // eslint-disable-line require-await

export const fastifyWithSocketIO = () => {
  console.log('registerPlugin...')
  FastifyInstance.addHook('onReady', () => {
    console.log('fastify server ready...')
  })

  FastifyInstance.register(socketio, {
    cors: {
      origin: process.env.NEXT_PUBLIC_SERVER_SOCKETIO_ALLOW_ORIGIN,
      methods: ['GET', 'POST']
    }
  })
  /**
   * Nextjs API POSTリクエストがInvalid Bodyで落ちるためParserを通過させる
   * https://github.com/vercel/next.js/issues/24894#issuecomment-845054678
   */
  FastifyInstance.addContentTypeParser('text/plain', noOpParser)
  FastifyInstance.addContentTypeParser('application/json', noOpParser)

  return FastifyInstance
}
