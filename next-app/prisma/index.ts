import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ["query", "error", "info", "warn"],
})

export { Prisma, prisma }