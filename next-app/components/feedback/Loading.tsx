import React from 'react'
import styles from './Loading.module.scss'

const Loading: React.FC = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.spinnerWrapper}>
        <span className={styles.spinner}></span>
        <span className={styles.spinnerText}>LOADING</span>
      </div>
    </div>
  )
}

export default Loading