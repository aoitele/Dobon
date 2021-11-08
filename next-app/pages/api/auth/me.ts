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
  // ユーザーデータ取得
  const user = await prisma.user.findFirst({
    where: {
      access_token: accesstoken
    },
    select: {
      id: true,
      nickname: true,
      status: true,
      expired_date: true,
      last_login: true
    }
  })
  if (user === null) {
    return res.status(500).json({
      error: true,
      message: [
        `ユーザー使用期限が切れました。${process.env.NEXT_PUBLIC_DOBON_HTTPS_URL}/user/create より再登録を行ってください。`
      ]
    })
  }

  // 作成部屋、参加部屋データを取得
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
    AND U.id = ${user.id}
  GROUP BY U.id
  ) AS MOGE, participants P
  WHERE MOGE.id = P.user_id
  GROUP BY
    MOGE.id,
    MOGE.nickname,
    MOGE.status,
    MOGE.expired_date,
    MOGE.last_login,
    MOGE.create_room_id,
    P.id
  `
  const addInfouser = await prisma.$queryRaw(sql)

  return typeof addInfouser[0] === 'undefined' ? res.json(user) : res.json(addInfouser[0])
}

export default usersMeApiCall