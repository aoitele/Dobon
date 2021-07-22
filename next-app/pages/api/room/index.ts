import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient({
    log: ["query", "error", "info", "warn"],
})

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    console.log(req.method,'req.method')
    switch(req.method) {
        case 'GET':
            return room(res)
        case 'POST':
            return create(req, res);
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}

const room = async (res: NextApiResponse) => {
    const response = await prisma.room.findMany().catch((err: any) => console.log(err, 'err'))
    return res.status(200).json({ rooms: response })
}

const create = (req: NextApiRequest, res: NextApiResponse) => {
    console.log(req.body,'body')
    return res.status(200).json({ method: 'create' })
}

export default handler;