import { prisma } from '../../../prisma'
import { NextApiRequest, NextApiResponse } from 'next'

const usersMeApiCall = async (req: NextApiRequest, res: NextApiResponse) => {
  const { accesstoken } = req.body
  if (!accesstoken) {
    return res.status(500).json({
      error: true,
      message: [
        `ユーザー登録が必要です。${process.env.NEXT_PUBLIC_DOBON_HTTPS_URL}/user/create より登録を行ってください。`
      ]
    })
  }
  const sql = `
  SELECT
    MOGE.id,
    MOGE.nickname,
    MOGE.status,
    MOGE.expired_date,
    MOGE.last_login,
    MOGE.create_room_id,
    array_agg(P.room_id) AS participate_room_id
  FROM (
    SELECT
      U.id,
      U.nickname,
      U.status,
      U.expired_date,
      U.last_login,
      array_agg(R.id) AS create_room_id
    FROM
      users U,
      rooms R
    WHERE U.id = R.create_user_id
  GROUP BY U.id
  ) AS MOGE, participants P
  WHERE P.user_id = 1
  GROUP BY
    MOGE.id,
    MOGE.nickname,
    MOGE.status,
    MOGE.expired_date,
    MOGE.last_login,
    MOGE.create_room_id,
    P.id
  `
  // ユーザーデータ取得
  const response = await prisma.$queryRaw(sql)
  if (response[0] === null) {
    return res.status(500).json({
      error: true,
      message: [
        `ユーザー使用期限が切れました。${process.env.NEXT_PUBLIC_DOBON_HTTPS_URL}/user/create より再登録を行ってください。`
      ]
    })
  }

  return res.json(response[0])
}

export default usersMeApiCall
