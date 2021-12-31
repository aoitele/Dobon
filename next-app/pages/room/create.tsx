import React, { useContext, useEffect } from 'react'
import axiosInstance from '../../utils/api/axiosInstance'
import { AuthStateContext } from '../../context/authProvider'
import { RoomCreateForm, RoomCreateResponse } from '../../@types/api/roomAPI'
import { useForm } from 'react-hook-form';

const defaultValues: RoomCreateForm = {
    title: '',
    status: 0,
    max_seat: 2,
    set_count: 10,
    rate: 1,
    invitation_code: '',
    create_user_id: null
}

const createRoom: React.FC = () => {
  const { authUser } = useContext(AuthStateContext)
  const { register, getValues, setValue, handleSubmit, formState: { errors }} = useForm({defaultValues})

  useEffect(() => {
    if (!authUser) return
    setValue('create_user_id', authUser.id)
  },[authUser])

  const isSetAllValues = ():boolean => {
    const values = getValues()
    const hasValue = (v: string | number | null) => v !== null && v !== ''
    const requiredFields = ['title', 'status', 'max_seat', 'set_count', 'rate', 'create_user_id']
    return Object.entries(values).filter(v => requiredFields.includes(v[0]) && hasValue(v[1])).length === requiredFields.length
  }

  const onSubmit = async (payload: RoomCreateForm) => {
    if (isSetAllValues()) {
      const axios = axiosInstance()
      try {
        const { data } = await axios.post<RoomCreateResponse>('/api/room', payload)
        if (data.result) {
          alert(`ルーム「${data.data.title}」を作成しました`)
        }
      } catch (e) {
        console.log(e)
      }
    } else {
      alert('必須項目が入力されていません')
    }
  }
  return (
    <>
      <div>RoomCreate</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="title">🏘ルーム名</label>
          <input
            type="text"
            {...register('title',{required: 'ルーム名は必須です'})}
          />
        </div>
        <div>
          <label htmlFor="max_seat">👤参加人数</label>
          <select {...register('max_seat',{required: '参加人数は必須です' })}>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>
        <div>
          <label htmlFor="set_count">🃏ゲーム数：</label>
          <select {...register('set_count',{required: 'ゲーム数は必須です' })}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </div>
        <div>
          <label htmlFor="rate">🎖スコアレート：</label>
          <select {...register('rate')}>
            <option value={1}>x1</option>
            <option value={3}>x3</option>
            <option value={5}>x5</option>
            <option value={10}>x10</option>
          </select>
        </div>
        <div>
          <label htmlFor="invitation_code">🔒パスワード(任意)：</label>
          <span>※設定するとパスワードを知っているユーザーのみが参加できるルームとなります</span>
          <input
            type="text"
            {...register('invitation_code')}
          />
        </div>
        <div style={{ color: 'red' }}>
          { Object.entries(errors).map(e => <p key={e[0]}>{e[1].message}</p>) }
        </div>
        <style jsx>{`
        .submitBtn {
          background-color: green;
          color:#ffffff;
          margin: 40px 0;
          padding: 10px;
          border-radius: 10px;
        }
        .submitBtnDisabled {
          background-color: lightgray;
          color:#ffffff;
          margin: 40px 0;
          padding: 10px;
          border-radius: 10px;
        }
        `}</style>
        <button type="submit" className='submitBtn'>ルームを作成する</button>
      </form>
    </>
  )
}

export default createRoom
