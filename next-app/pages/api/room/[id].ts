import { prisma, prismaInitializeError } from '../../../prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query

  switch (req.method) {
    case 'GET':
      return handleGET(id, res)
    case 'POST':
      return handlePOST(req, res)
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

const handleGET = async (id: string | string[], res: NextApiResponse) => {
  if (prisma === null) {
    throw prismaInitializeError()
  }

  const roomData = await prisma.room.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      user: true
    }
  })
  res.json({ room: roomData })
}

const handlePOST = (req: NextApiRequest, res: NextApiResponse) => {
  res.json({ method: 'update' })
}

export default handler
