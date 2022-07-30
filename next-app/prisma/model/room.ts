import { prisma } from '../index'
import { NextApiRequest, NextApiResponse } from "next"

/**
 * 「フレンド対戦」選択時のデータ取得処理
 * ・自分が主催のゲーム情報
 * ・（招待コード）が送られた場合、該当するゲーム情報
 * を返却する
 */
const getRooms = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req // Online | friend
  const invitaionCode = query.invitationCode

  if (typeof invitaionCode === 'string') {
    const room = await prisma?.room.findFirst({
      include: {
        user: {
          select: {
            nickname: true
          }
        }
      },
      where: {
        invitation_code: invitaionCode
      }
    })
    res.json([room])
  }

  const rooms = await prisma?.room.findMany({
    include: {
      user: {
        select: {
          nickname: true
        }
      }
    },
    where: {
      create_user_id: Number(query.userId)
    }
  })
  res.json(rooms)
}

export { getRooms }