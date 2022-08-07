import React, { useState } from 'react'
import { loginWithForm } from '../../../utils/auth/login'
import userCreate from '../../../utils/auth/userCreate'
import style from './login.module.scss'
import nookies from 'nookies'

interface FormState {
  nickname: string
  password: string
  error: boolean
  messages: { message:string }[]
  disableBtn: boolean
}


const formState: FormState = {
  nickname: '',
  password: '',
  error: false,
  messages: [],
  disableBtn: false,
}

const LoginPage: React.FC = () => {
  const [state, setState] = useState(formState)

  const handleChange = (event: { target: { name: any; value: any } }) => {
    setState({ ...state, [event.target.name]: event.target.value })
  }

  const handleValidate = () => {
    const isEmptyNickname = state.nickname.length === 0
    const isEmptyPassword = state.password.length === 0
    if (isEmptyNickname || isEmptyPassword) {
      const emptyInput = (isEmptyNickname && isEmptyPassword) ? 'ニックネーム/パスワード' : isEmptyNickname ? 'ニックネーム' : 'パスワード' 
      const message = `${emptyInput}を入力ください。`
      setState((prevState)=> ({...prevState, error: true, messages: [{ message }]}))
      return false
    }
    return true
  }

  const handleSubmit = async(mode: 'login' | 'create') => {
    if (!handleValidate()) return

    setState((prevState)=> ({...prevState, messages:[], disableBtn:true}))
    const args = {
      nickname: state.nickname,
      password: state.password
    }

    try {
      const res = await (mode === 'login' ? loginWithForm(args) : userCreate(args))
      const data = res.data
      if (data && data.errors) {
        setState((prevState)=> ({...prevState, error:true, messages: data.errors, disableBtn: false}))
        return
      }
      if (data.access_token) {
        nookies.set(null, 'accesstoken', data.access_token, {
          maxAge: 30 * 24 * 60 * 60, // 30day
          path: '/'
        })
      }

      if (mode === 'create') {
        alert(`ユーザー「${data.nickname}」を登録しました`)
      }
      location.assign('/')
    } catch(e) {
      setState((prevState)=> ({...prevState, error:true, messages: [{message:'失敗しました。時間をおいて再度お試しください。'}], disableBtn: false}))
    }
  } 
  
  return (
    <div className={style.wrap}>
      <form>
        <div>
          <label htmlFor="nickname">ニックネーム</label>
          <input
            type="text"
            name="nickname"
            value={state.nickname}
            onChange={(e) => handleChange(e)}
            className={style.formInput}
          />
        </div>
        <label htmlFor="nickname">パスワード</label>
        <div className={style.formPw}>
          <input
            type="password"
            name="password"
            value={state.password}
            onChange={(e) => handleChange(e)}
            className={style.formInput}
          />
          <span className={style.showPwBtn}/>
        </div>
      </form>
      <div className={style.btnWrap}>
        <button
          className={state.disableBtn ? style.btn__disabled : style.btn__active}
          onClick={() => state.disableBtn ? undefined : handleSubmit('create')}
        >新規登録</button>
      </div>
      <div className={style.btnWrap}>
        <button
          className={state.disableBtn ? style.btn__disabled : style.btn__active}
          onClick={() => state.disableBtn ? undefined : handleSubmit('login')}
        >
          <span className={style.loginBtn_Attention}>（すでに登録済みの方）</span>
          ログイン
        </button>
      </div>
      {state.error && (
        <div className={style.errorMsg}>
          <ul>
            {state.messages.map((item, idx) => (
              <li key={idx}>⚠️{item.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
export default LoginPage