import React, { Dispatch, FC, SetStateAction } from 'react'
import { TopPageState } from '../index'
import styles from './PVESelecterModal.module.scss'
import { usePveSelecter } from '../../../../hooks/usePveSelecter'

interface Props {
  initialState: TopPageState
  setValues: Dispatch<SetStateAction<TopPageState>>
  isCalledByResultBoard: boolean
}

const PVESelecterModal:FC<Props> = ({ initialState, setValues, isCalledByResultBoard }) => {
  const gameSet = [3, 5, 10]
  const { pveSelecter, setPveSelecter, setUserMode, gameStart } = usePveSelecter()

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
              {pveSelecter.users.map((user, index) => {
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
              })}
            </ul>            
          </>
          <div>
            <label htmlFor="setCount">ゲーム数</label>
            <div className={styles.setCount}>
              {gameSet.map(setCount => {
                return (
                  <span
                    key={setCount}
                    className={pveSelecter.setCount === setCount ? styles.active : undefined}
                    onClick={() => setPveSelecter({...pveSelecter, setCount})}
                  >
                    {setCount}
                  </span>
                )
              })}
            </div>
          </div>
          <button 
            onClick={() => gameStart({ isCalledByResultBoard })}
            className={styles.submitBtn}
          >ゲームを始める</button>
        </div>
      </div>
      <div className={styles.modalBack} onClick={() => setValues(initialState)}/>
    </>
  )
}

export default PVESelecterModal