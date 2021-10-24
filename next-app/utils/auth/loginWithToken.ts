import { parseCookies } from "nookies"
import axiosInstance from "../api/axiosInstance"

interface LoginResponse {
    result: boolean;
    data: AuthAPIResponse.UserMe;
}

interface LoginErrorResponse {
    result: boolean;
    err?: any
}

const loginWithToken = async (): Promise<LoginResponse | LoginErrorResponse> => {
    const { accesstoken } = parseCookies()
    if (!accesstoken) { return { result: false } }

    const axios = axiosInstance()
    try {
        const { data } = await axios.post<AuthAPIResponse.UserMe>('/api/auth/me', { accesstoken })
        if (!data) { return { result :false } }
        return { result:true, data }
    } catch(err) {
        return { result :false, err }
    }
}

export default loginWithToken