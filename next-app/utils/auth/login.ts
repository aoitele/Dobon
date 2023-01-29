import axiosInstance from '../api/axiosInstance'
import { AuthAPIResponse } from '../../@types/api/authAPI'

const axios = axiosInstance()

interface LoginResponse {
  data: AuthAPIResponse.UserMe | null
}

interface LoginWithFormArgs {
  nickname: string
  password: string
}

const loginWithForm = async({nickname, password}:LoginWithFormArgs): Promise<any> => {
  const { data } = await axios.post<AuthAPIResponse.UserMe>('/api/auth/me', { nickname, password })
  return { data: data ?? null }
}

const loginWithToken = async (accesstoken: string): Promise<LoginResponse> => {
  const { data } = await axios.post<AuthAPIResponse.UserMe>('/api/auth/me', { accesstoken })
  return { data: data ?? null }
}

export { loginWithForm, loginWithToken }