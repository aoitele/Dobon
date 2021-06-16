import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient({
    log: ["query", "error", "info", "warn"],
})

const main = async (req: NextApiRequest, res: NextApiResponse) => {
    const allUsers = await prisma.users.findMany().catch((err: any) => console.log(err, 'err'))
    console.log(allUsers, 'users')
    res.status(200).json({ name: 'John Doe3' })
}

export default main;