import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient({
    log: ["query", "error", "info", "warn"],
})

const rooms = async (req: NextApiRequest, res: NextApiResponse) => {
    const response = await prisma.room.findMany().catch((err: any) => console.log(err, 'err'))
    res.status(200).json({ rooms: response })
}

export default rooms;