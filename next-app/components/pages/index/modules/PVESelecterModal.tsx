import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import { TopPageState } from '../index'
import styles from './PVESelecterModal.module.scss'
import { usePveSelecter } from '../../../../hooks/usePveSelecter'
import Loading from '../../../feedback/Loading'

interface Props {
  initialState: TopPageState
  setValues: Dispatch<SetStateAction<TopPageState>>
  isCalledByResultBoard: boolean
}

const PVESelecterModal:FC<Props> = ({ initialState, setValues, isCalledByResultBoard }) => {
  const [loading, setLoading] = useState(false)
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
            <>
              <label htmlFor="max_seat">Participant</label>
              <div className={styles.paticipantsWrap}>
                <div className={styles.paticipantsHeader}>
                  <span>Name</span>
                  <span>Strength</span>
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
                            <option value='hard'>hard</option>
                            <option value='normal'>normal</option>
                            <option value='easy'>easy</option>
                          </select>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </>
            <div>
              <label htmlFor="setCount">setCount</label>
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
            {loading
            ? <div className={styles.loadingWrap}><Loading fullScreen={false}/></div>
            : <button
                onClick={() => {
                  setLoading(true)
                  gameStart({ isCalledByResultBoard })
                }}
                className={styles.submitBtn}
              >Game Start</button>
            }
          </>
        </div>
      </div>
      <div className={styles.modalBack} onClick={() => setValues(initialState)}/>
    </>
  )
}

export default PVESelecterModal