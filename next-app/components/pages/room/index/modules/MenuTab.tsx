import React, { Dispatch, SetStateAction, VFC } from 'react'
import { RoomIndexState } from '..'
import styles from './MenuTab.module.scss'

interface Props {
  values: RoomIndexState
  setValues: Dispatch<SetStateAction<RoomIndexState>>
}

const RoomIndex:VFC<Props> = ({ values, setValues }) => {
  
  return (
    <ul className={styles.tabMenu}>
      <li
        className={values.isActiveFriend ? styles.active :undefined}
        onClick={() => setValues({...values, isActiveOnline:false, isActiveFriend:true, loading:true})}
      >
        <span>✋フレンド対戦</span>
      </li>
      <li 
        className={values.isActiveOnline ? styles.active :undefined}
        onClick={() => setValues({...values, isActiveOnline:true, isActiveFriend:false, loading:true})}
      >
        <span>🌐オンライン対戦</span>
      </li>
    </ul>
  )
}

export default RoomIndex