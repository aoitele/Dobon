import { prisma } from '../index'
import { NextApiRequest, NextApiResponse } from "next"

const getRooms = async (req: NextApiRequest, res: NextApiResponse) => {
  const rooms = await prisma?.room.findMany({
    include: {
      user: {
        select: {
          nickname: true
        }
      }
    },
    where: {}
  })
  res.json({ rooms })  
}

export { getRooms }