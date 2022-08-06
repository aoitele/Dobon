import { prisma, Prisma } from '../../../prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  createAccessToken,
  hashedPassword
} from '../../../utils/function/createHash'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id
  const data = req.body

  switch (req.method) {
    case 'GET':
      return handleGET(id, res)
    case 'POST':
      return handlePOST(data, res)
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

const handleGET = async (id: string | string[], res: NextApiResponse) => {
  if (prisma === null) { return res.status(500).json({ error: 'PrismaClientInitializationError'})}
  const response = await prisma.user.findMany()
  return res.json({ users: response })
}

const handlePOST = async (data: any, res: NextApiResponse) => {
  if (prisma === null) { return res.status(500).json({ error: 'PrismaClientInitializationError'})}

  // トークンを発行してクライアント側でcookieにセット
  const { nickname, password } = data
  const token = createAccessToken(nickname, password)
  const hpass = hashedPassword(nickname, password)
  try {
    const response = await prisma.user.create({
      data: {
        nickname,
        password: hpass,
        status: 1,
        access_token: token
      }
    })
    return res.json(response)
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return res.json({
          errors: [
            { message: `ユーザー名「${nickname}」は既に使用されています。別の名前で登録してください。` }
          ]
        })
      }
    }
    return res.status(500)
  }
}

export default handler
