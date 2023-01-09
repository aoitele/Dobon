import { FastifyReply, FastifyRequest } from "fastify";
const { randomUUID } = require("crypto");

export const getPveKey = (_req: FastifyRequest, res: FastifyReply) => {
  res.send({ pveKey: randomUUID() })
}
