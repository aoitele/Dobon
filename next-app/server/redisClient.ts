import Redis from "ioredis";

const dev = process.env.NODE_ENV !== 'production'

const pubClient = dev ? new Redis(Number(process.env.REDIS_PORT), process.env.REDIS_HOST) : new Redis(process.env.REDIS_URL)
const subClient = pubClient.duplicate();

export { pubClient, subClient }