import { Prisma, prisma } from '../../../prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

const handle = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return handleGET(res)
    case 'POST':
      return handlePOST(req, res)
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

const handleGET = async (res: NextApiResponse) => {
  const rooms = await prisma?.room.findMany({
    include: {
      user: {
        select: {
          nickname: true
        }
      }
    }
  })
  res.json({ rooms })  
}

const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { title, status, invitation_code, max_seat, set_count, rate, create_user_id } =
    req.body
  console.log(req.body,'body')
  const payload: Prisma.RoomUncheckedCreateInput = {
    title,
    status,
    invitation_code,
    max_seat: Number(max_seat),
    set_count: Number(set_count),
    rate: Number(rate),
    create_user_id
  }
  
  const result = await prisma?.room.create({ data: payload })
  res.json({
    result: true,
    data: result
  })
}

export default handle
