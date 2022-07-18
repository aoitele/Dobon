import { prisma } from '../index'
import { NextApiRequest, NextApiResponse } from "next"

/**
 * 「フレンド対戦」選択時のデータ取得処理
 * ・自分が主催のゲーム情報
 * ・（招待コード）が送られた場合、該当するゲーム情報
 * を返却する
 */
const getRooms = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query // Online | friend
  const rooms = await prisma?.room.findMany({
    include: {
      user: {
        select: {
          nickname: true
        }
      }
    },
    where: {
      create_user_id: Number(userId)
    }
  })
  res.json(rooms)
}

export { getRooms }