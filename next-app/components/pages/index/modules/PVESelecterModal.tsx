import React, { useState, Dispatch, FC, SetStateAction, useContext } from 'react'
import { initialState, TopPageState } from '../index'
import styles from './PVESelecterModal.module.scss'
import { useRouter } from 'next/router'
import { AuthStateContext } from '../../../../context/authProvider'
import { isLoggedIn } from '../../../../utils/auth/authState'
import { CPULevel, CPUName } from '../../../../@types/game'
import { isCpuLevelValue } from '../../../../utils/game/cpu/utils/isCPULevelValue'
import axiosInstance from '../../../../utils/api/axiosInstance'

interface SelecterValues {
  users: {
    name: CPUName
    mode: CPULevel
    icon: '🐰' | '🐶' | '😾'
  }[],
  set_count: number
}

const defaultValues: SelecterValues = {
  users: [
    { name: 'com1', mode: 'normal', icon: '🐰' },
    { name: 'com2', mode: 'normal', icon: '🐶' },
    { name: 'com3', mode: 'normal', icon: '😾' },
  ],
  set_count: 10,
}

interface Props {
  setValues: Dispatch<SetStateAction<TopPageState>>
}

const PVESelecterModal:FC<Props> = ({ setValues }) => {
  const [pveValues, setPveValues] = useState(defaultValues)
  const { authUser } = useContext(AuthStateContext)
  const gameSet = [10, 20, 30]
  const router = useRouter()

  const setUserMode = (e: React.ChangeEvent<HTMLSelectElement>, index:number) => {
    const users = pveValues.users
    if (isCpuLevelValue(e.currentTarget.value)) {
      users[index].mode = e.currentTarget.value
      setPveValues({...pveValues, users })
    }
  }

  const toPVEQueryString = (pveKey: string) => {
    let qs = ''
    qs += `pveKey=${pveKey}`
    qs += `&setCount=${pveValues.set_count}`
    if (isLoggedIn(authUser)) {
      qs += `&me=${authUser.nickname}`
    }
    pveValues.users.forEach(user => {
      qs += `&${user.name}=${user.mode}`
    })
    return qs
  }

  const handleSubmit = async() => {
    let pveKey = localStorage.getItem('pveKey')
    if (!pveKey) {
      try {
        const res = await axiosInstance().get<{'pveKey': string}>('/pve-key')
        if (!res.data.pveKey) {
          throw new Error('pveKey not provided')
        }
        pveKey = res.data.pveKey
        localStorage.setItem('pveKey', pveKey)
      } catch(e) {
        alert('通信に失敗しました。時間をおいて再度お試しください。')
      }
    }

    if (!pveKey) return
    router.push({
      pathname: '/pve',
      query: toPVEQueryString(pveKey)
    }, '/')
  }

  return (
    <>
      <div className={`${styles.modalWrap} ${styles.modalOpen}`}>
        <button
          className={styles.closeBtn}
          onClick={() => setValues(initialState)}
        >×</button>
        <div className={styles.modalInner}>
          <>
            <label htmlFor="max_seat">参加者</label>
            <div className={styles.paticipantsHeader}>
              <span>名前</span>
              <span>強さ</span>
            </div>
            <ul className={styles.paticipants}>
              {
                pveValues.users.map((user, index) => {
                  return (
                    <li key={index}>
                      <div>{user.name}{user.icon}</div>
                      <div>
                        <select
                          value={user.mode}
                          onChange={(e) => setUserMode(e, index)}
                        >
                          <option value='hard'>強い</option>
                          <option value='normal'>ふつう</option>
                          <option value='easy'>弱い</option>
                        </select>
                      </div>
                    </li>
                  )
                })
              }
            </ul>            
          </>
          <div>
            <label htmlFor="set_count">ゲーム数</label>
            <div className={styles.setCount}>
              {gameSet.map(setCount => {
                return (
                  <span
                    key={setCount}
                    className={pveValues.set_count === setCount ? styles.active : undefined}
                    onClick={() => setPveValues({...pveValues, set_count: setCount})}
                  >
                    {setCount}
                  </span>
                )
              })}
            </div>
          </div>
          <button 
            onClick={() => handleSubmit()}
            className={styles.submitBtn}
          >ゲームを始める</button>
        </div>
      </div>
      <div className={styles.modalBack} onClick={() => setValues(initialState)}/>
    </>
  )
}

export default PVESelecterModal