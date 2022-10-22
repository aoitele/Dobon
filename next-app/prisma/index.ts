import { Prisma, PrismaClient } from '@prisma/client'

/**
 * HMRが作動しコネクション数が増えるため
 * 開発モードではprismaをglobalにセットして単一インスタンスで扱う
 */

 declare global {
  namespace NodeJS { // eslint-disable-line no-unused-vars
      interface Global { // eslint-disable-line no-unused-vars
        prismaClient: PrismaClient
      }
  }
}

let prisma: PrismaClient | null = null;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ log: ['query', 'error', 'info', 'warn'] })
} else {
  if (!global.prismaClient) {
    global.prismaClient = new PrismaClient({ log: ['error', 'info', 'warn'] })
  }
  prisma = global.prismaClient
}

const prismaInitializeError = (): Promise<void> => Promise.reject(new Error('PrismaClientInitializationError'))

export { Prisma, prisma, prismaInitializeError }
