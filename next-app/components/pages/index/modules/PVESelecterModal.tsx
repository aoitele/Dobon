import React, { useState, Dispatch, FC, SetStateAction } from 'react'
import { initialState, TopPageState } from '../index'
import styles from './PVESelecterModal.module.scss'

const defaultValues = {
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
  const gameSet = [10, 20, 30]

  const setUserMode = (e: React.ChangeEvent<HTMLSelectElement>, index:number) => {
    const users = pveValues.users
    users[index].mode = e.currentTarget.value
    setPveValues({...pveValues, users})    
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
                          <option value="hard">強い</option>
                          <option value="normal">ふつう</option>
                          <option value="easy">弱い</option>
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
          <button type="submit" className={styles.submitBtn}>ゲームを始める</button>
        </div>
      </div>
      <div className={styles.modalBack} onClick={() => setValues(initialState)}/>
    </>
  )
} 

export default PVESelecterModal