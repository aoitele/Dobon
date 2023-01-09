import { FastifyInstance } from 'fastify'
import { getPveKey } from './pve'

const fastifyAPIRouteSet =(fastify: FastifyInstance) => {
  fastify.get('/pve-key', (req, res) => getPveKey(req, res))
}

export { fastifyAPIRouteSet }