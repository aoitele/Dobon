import React from 'react'
import { initialStateType } from './board/index' 
import { emit, Props } from '../../utils/game/emit'
import style from './ActionBtn.module.scss'

interface Args {
  text: string
  styleClass: string
  isBtnActive: boolean
  setValues: React.Dispatch<React.SetStateAction<initialStateType>>
  emitArgs?: Props
}

const actionBtn: React.FC<Args> = ({ text, styleClass, isBtnActive, setValues, emitArgs }) => {
  const addEmitArgEvent = (args: Props, event: string) => {
    args.emitData.event = event
    return args
  }

  return (
    <>
    { text === 'アクション' && isBtnActive &&
      <div className={style.menu}>
        <span className={style.menuBtn} onClick={() => emitArgs ? emit(addEmitArgEvent(emitArgs, 'drawcard')) : undefined}>ドロー</span>
        <span className={style.menuBtn} onClick={() => emitArgs ? emit(addEmitArgEvent(emitArgs, 'turnchange')) : undefined}>スキップ</span>
      </div>
    }
      <div
      className={`${style[styleClass]} ${isBtnActive && 'active'}`}
      onClick={(e) => setValues({ 
        selectedCard:'',
        isBtnActive: e.currentTarget.innerText === 'アクション' && !isBtnActive,
        isModalActive: e.currentTarget.innerText === 'どぼん！'
      })}
      >{text}</div>
    </>
  )
}

export default actionBtn
