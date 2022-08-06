import axiosInstance from "../api/axiosInstance"

interface UserCreateArgs {
  nickname: string
  password:string
}

const userCreate = async ({ nickname, password }:UserCreateArgs) => {
  const axios = axiosInstance()
  try {
    const res = await axios.post('/api/user', {nickname, password})
    console.log(res, 'resaaa')
    /*
     * If (res.data.errors && res.data.errors.length > 0) {
     *   // ユーザー名重複エラーは正常系で返しているため、ここでリターン
     *   return res
     * }
     */
    return { data: res.data }
  } catch (e: any) {
    return e
  }
}

export default userCreate