import { prisma } from '../../../prisma'
import { NextApiRequest, NextApiResponse } from 'next'

const usersMeApiCall = async (req: NextApiRequest, res: NextApiResponse) => {
    const { accesstoken } = req.body
    if (!accesstoken) {
        return res.status(500).json({
            error: true,
            message: [`ユーザー登録が必要です。${process.env.NEXT_PUBLIC_DOBON_HTTPS_URL}/user/create より登録を行ってください。`]
        })
    }
    const response = await prisma.user.findFirst({
        where: {
            access_token: accesstoken
        },
        select: {
            id: true,
            nickname: true,
            status: true,
            expired_date: true,
            last_login: true,
        }
    }) 
    if (response === null) {
        return res.status(500).json({
            error: true,
            message: [`ユーザー使用期限が切れました。${process.env.NEXT_PUBLIC_DOBON_HTTPS_URL}/user/create より再登録を行ってください。`]
        })
    }

    return res.json(response)
} 

export default usersMeApiCall;