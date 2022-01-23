import React from 'react'
import { initialState } from './board/index' 
import { InitialBoardState } from '../../@types/game'
import { emit, Props } from '../../utils/game/emit'
import style from './ActionBtn.module.scss'

interface Args {
  text: 'アクション' | 'どぼん！' | 'スキップ' | 'ドロー' | 'デッキセット＆ドロー'
  styleClass: 'action' | 'dobon' | 'active' | 'disabled' | 'skip' | 'draw'
  values: InitialBoardState
  setValues: React.Dispatch<React.SetStateAction<InitialBoardState>>
  isMyTurn: boolean
  emitArgs?: Props
}

const actionBtn: React.FC<Args> = ({ text, styleClass, values, setValues, emitArgs }) => {
  const addEmitArgEvent = (args: Props, event: string) => {
    args.emitData.event = event
    return args
  }

  const draw = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (!emitArgs) return
    e.currentTarget.innerText === 'デッキセット＆ドロー'
    ? await emit(addEmitArgEvent(emitArgs, 'drawcard__deckset'))
    : await emit(addEmitArgEvent(emitArgs, 'drawcard'))

    setValues({
      ...initialState,
      isBtnActive: {
        action: false,
        dobon: false
      },
      isDrawnCard: true,
      actionBtnStyle: 'skip',
      dobonBtnStyle: 'disabled'
    })
  }

  const turnChange = () => {
    if (!emitArgs) return
    emit(addEmitArgEvent(emitArgs, 'turnchange'))
  }

  const btnFn = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (!emitArgs || styleClass === 'disabled') return
    const toggleClass = values.actionBtnStyle === 'action' ? 'active' : 'action'

    switch(styleClass) {
      case 'draw':
        draw(e)
        break
      case 'skip':
        turnChange()
        break
      case 'dobon':
        await emit(addEmitArgEvent(emitArgs, 'dobon'))
        break
      case 'action':
        setValues({
          ...initialState,
          actionBtnStyle: toggleClass,
          isBtnActive: {
            ...values.isBtnActive,
            action: !values.isBtnActive.action
          }
        })
        break
      default : break;
    }
  }
  return (
    <>
      { text === 'アクション' && values.isBtnActive.action &&
        <div className={style.menu}>
          <span className={style.menuBtn} onClick={(e) => draw(e)}>ドロー</span>
          { values.isDrawnCard && 
          <span className={style.menuBtn} onClick={() => turnChange()}>スキップ</span>
          }
        </div>
      }
      <div
        className={style[styleClass]}
        onClick={(e) => btnFn(e)}
      >{text}</div> 
    </>
  )
}

export default actionBtn
