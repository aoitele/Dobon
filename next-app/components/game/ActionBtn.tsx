import React from 'react'
import { initialState, initialStateType } from './board/index' 
import { emit, Props } from '../../utils/game/emit'
import style from './ActionBtn.module.scss'

interface Args {
  text: 'アクション' | 'どぼん！'
  styleClass: 'action' | 'dobon'
  values: initialStateType
  isMyturn?: boolean
  setValues: React.Dispatch<React.SetStateAction<initialStateType>>
  emitArgs?: Props
}

const actionBtn: React.FC<Args> = ({ text, styleClass, values, setValues, emitArgs }) => {
  
  const addEmitArgEvent = (args: Props, event: string) => {
    args.emitData.event = event
    return args
  }

  const draw = async () => {
    if (!emitArgs) return
    await emit(addEmitArgEvent(emitArgs, 'drawcard'))
    setValues({
      ...initialState,
      isBtnActive: {
        action: false,
        dobon: false
      }
    })
  }

  const turnChange = () => {
    if (!emitArgs) return
    emit(addEmitArgEvent(emitArgs, 'turnchange'))
  }

  const btnFn = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setValues({
      ...initialState,
      selectedCard:'',
      isBtnActive: {
        ...values.isBtnActive,
        [styleClass]: !values.isBtnActive[styleClass]
      },
      isModalActive: e.currentTarget.innerText === 'どぼん！',
    });
  }
  return (
    <>
      { text === 'アクション' && values.isBtnActive.action && !values.isModalActive &&
        <div className={style.menu}>
          <span className={style.menuBtn} onClick={() => draw()}>ドロー</span>
          <span className={style.menuBtn} onClick={() => turnChange()}>スキップ</span>
        </div>
      }
      <div
        className={`${style[styleClass]} ${values.isBtnActive[styleClass] ? 'active' : ''}`}
        onClick={(e) => btnFn(e)}
      >{text}</div> 
    </>
  )
}

export default actionBtn
