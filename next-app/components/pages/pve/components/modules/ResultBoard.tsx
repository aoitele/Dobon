import React, { useContext, useState } from "react"
import { Player } from "../../../../../@types/game"
import styles from '../../../../game/score/ResultBoard.module.scss'
import Image from 'next/image'
import { GameStateContext } from "../../../../../context/GameProvider"
import PVESelecterModal from "../../../index/modules/PVESelecterModal"
import { initialState } from "../../../index"

type AddRankPlayers =(Player & { rank: number })[]

const ResultBoard = () => {
  const [values, setValues] = useState(initialState)
  const gameState = useContext(GameStateContext)
  const users: AddRankPlayers = gameState.game.board.users.sort((a, b) => b.score - a.score).map((user, idx) => ({...user, rank: idx + 1}))

  return (
  <>
    <div className={styles.wrap}>
      <p className={styles.headline}>Game Result</p>
      {users.map(user => 
          <div key={user.turn} className={styles[`userInfo__${user.rank}`]}>
            <div className={styles[`rank__${user.rank}`]}>{user.rank}</div>
            <div className={styles.userInfo}>
              <div className={styles.userIcon}>
                <Image
                  src={`/images/game/userIcon/${user.turn}.png`}
                  width={70}
                  height={70}
                />
              </div>
              <div className={styles.nameAndScore}>
                <p>{user.nickname}</p>
                <p><span className={styles.star}>⭐️</span>{user.score}</p>
              </div>
            </div>
          </div>
        )
      }
      <div className={styles.btnContainer}>
        <div className={styles.btnWrap}>
          <a href="/" className={styles.link__home}>{`<< HOME`}</a>
        </div>
        <div className={styles.btnWrap}>
          <button
            className={styles.link__newGame}
            onClick={() => setValues({ ...values, selectedPvE: true })}
          >{`newGame >>`}</button>
        </div>
      </div>
    </div>
    {values.selectedPvE && <PVESelecterModal initialState={initialState} setValues={setValues} isCalledByResultBoard={true} />}
  </>
  )

}

export { ResultBoard }