import { Prisma, PrismaClient } from '@prisma/client'

/**
 **
 * HMRが作動しコネクション数が増えるため
 * 開発モードではprismaをglobalにセットして単一インスタンスで扱う
 */

let prisma: PrismaClient | Partial<PrismaClient> = {};

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ log: ['query', 'error', 'info', 'warn'] })
} else {
  if (!global.prismaClient) {
    global.prismaClient = new PrismaClient({ log: ['query', 'error', 'info', 'warn'] })
  }
  prisma = global.prismaClient
}

export { Prisma, prisma }
