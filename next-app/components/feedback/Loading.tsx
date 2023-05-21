import React from 'react'
import styles from './Loading.module.scss'

interface Props {
  fullScreen: boolean
}

const Loading: React.FC<Props> = ({ fullScreen }) => {
  return (
    <div className={fullScreen ? styles.loadingFs : styles.loadingSpinnerOnly}>
      <div className={fullScreen ? styles.spinnerWrapperFs : styles.spinnerWrapper}>
        <span className={styles.spinner}></span>
        <span className={styles.spinnerText}>LOADING</span>
      </div>
    </div>
  )
}

export default Loading