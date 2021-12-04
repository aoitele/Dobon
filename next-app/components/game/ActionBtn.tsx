import React from 'react'
import { initialStateType } from './board/index' 
import style from './ActionBtn.module.scss'

interface Props {
  text: string
  styleClass: string
  isBtnActive: boolean
  setValues: React.Dispatch<React.SetStateAction<initialStateType>>
}

const actionBtn: React.FC<Props> = ({ text, styleClass, isBtnActive, setValues }) => {

  return (
    <>
    { text === 'アクション' && isBtnActive &&
      <div className={style.menu}>
        <span className={style.menuBtn}>⚫︎</span>
        <span className={style.menuBtn}>⚫︎</span>
      </div>
    }
      <div
      className={`${style[styleClass]} ${isBtnActive && 'active'}`}
      onClick={(e) => setValues({ 
        selectedCard:'',
        isBtnActive: e.currentTarget.innerText === 'アクション' && !isBtnActive
      })}
      >{text}</div>
    </>
  )
}

export default actionBtn
