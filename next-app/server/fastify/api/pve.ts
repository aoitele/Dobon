import { FastifyReply, FastifyRequest } from "fastify";

export const getPveKey = (_req: FastifyRequest, res: FastifyReply) => {
  const date = new Date();
  date.setTime(date.getTime() + (9*60*60*1000));
  const str_date = date.toISOString().replace('T', ' ').substr(0, 19);
  console.log(str_date);
  res.send({ pveKey: `sample-pveKey-${str_date}` })
}
