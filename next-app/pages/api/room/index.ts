import { Prisma, prisma } from '../../../prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

const handle = (req: NextApiRequest, res: NextApiResponse) => {
    
    switch(req.method) {
        case 'GET':
            return handleGET(res)
        case 'POST':
            return handlePOST(req, res);
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}

const handleGET = async (res: NextApiResponse) => {
    const rooms = await prisma.room.findMany()
    res.json({ rooms })
}

const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
    const { title, status, invitation_code, max_seat, set_count, rate, user } = req.body
    const payload: Prisma.RoomCreateInput = { title, status, invitation_code, max_seat, set_count, rate, user }

    try {
        const result = await prisma.room.create({ data: payload })
        res.json({ result })
    } catch(e) {
        console.log(e)
    }
}

export default handle;