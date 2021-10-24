import React from 'react'
import axiosInstance from '../../utils/api/axiosInstance'
import { parseCookies } from 'nookies'

const login = () => {
  const handleSubmit = async () => {
    const { accesstoken } = parseCookies()
    if (!accesstoken) return

    const axios = axiosInstance()
    try {
      const res = await axios.post('/api/auth/me', { accesstoken })
      console.log(res, 'res')
    } catch (e: any) {
      console.log(e, 'error')
    }
  }
  return (
    <>
      <div>Send Token</div>
      <button onClick={() => handleSubmit()}>try Login</button>
    </>
  )
}

export default login
