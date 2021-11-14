import React, { useState } from 'react'
import { useRouter } from 'next/router'
import axiosInstance from '../../utils/api/axiosInstance'
import nookies from 'nookies'

const initialValue = {
  nickname: '',
  password: '',
  error: false,
  messages: []
}

const createRoom: React.FC = () => {
  const [form, setForm] = useState(initialValue)
  const router = useRouter()

  const handleChange = (event: { target: { name: any; value: any } }) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async () => {
    const axios = axiosInstance()
    try {
      const { data } = await axios.post('/api/user', form)
      if (data.access_token) {
        nookies.set(null, 'accesstoken', data.access_token, {
          maxAge: 30 * 24 * 60 * 60, // 30day
          path: '/'
        })
        alert(`ユーザー「${data.nickname}」を登録しました`)
        router.push('/')
      }
    } catch (e: any) {
      console.log(e, 'error')
      alert(e)
      // Const { error, messages } = e.response.data
      setForm({ ...form })
    }
  }
  return (
    <>
      <div>UserCreate</div>
      <form>
        <div>
          <label htmlFor="name">ニックネーム</label>
          <input
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <label htmlFor="name">パスワード</label>
          <input
            type="text"
            name="password"
            value={form.password}
            onChange={(e) => handleChange(e)}
          />
        </div>
      </form>
      {form.error && (
        <ul>
          {form.messages.map((message, idx) => (
            <li key={idx}>{message}</li>
          ))}
        </ul>
      )}
      <a href="#" onClick={() => handleSubmit()}>登録</a>
    </>
  )
}

export default createRoom
