import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient({
    log: ["query", "error", "info", "warn"],
})

const rooms = async (req: NextApiRequest, res: NextApiResponse) => {
    const allRooms = await prisma.rooms.findMany().catch((err: any) => console.log(err, 'err'))
    console.log(allRooms, 'rooms')
    res.status(200).json({ name: 'John Doe3' })
}

export default rooms;