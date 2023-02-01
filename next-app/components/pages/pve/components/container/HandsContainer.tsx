import React, { FC } from "react"
import styles from './HandsContainer.module.scss'
import Hands from "../modules/Hands"

const HandsContainer:FC = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.slides}>
        <Hands />
      </div>
    </div>
  )
}

export { HandsContainer }