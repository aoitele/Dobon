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

export const addEmitArgEvent = (args: Props, event: string) => {
  args.emitData.event = event
  return args
}

const actionBtn: React.FC<Args> = ({ text, styleClass, values, setValues, emitArgs }) => {

  const draw = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (!emitArgs) return
    if (values.loading) return
    setValues((prevState) => ({...prevState, loading:true }))

    e.currentTarget.innerText === 'デッキセット＆ドロー'
    ? emit(addEmitArgEvent(emitArgs, 'drawcard__deckset'))
    : emit(addEmitArgEvent(emitArgs, 'drawcard'))

    setValues(() => ({
      ...initialState,
      isBtnActive: {
        action: false,
        dobon: false
      },
      isMyTurn: true,
      isMyTurnConsecutive: values.isMyTurnConsecutive,
      isDrawnCard: true,
      actionBtnStyle: 'skip',
      dobonBtnStyle: 'disabled',
      loading: false
    }))
  }

  const turnChange = () => {
    if (!emitArgs) return
    if (values.loading) return
    setValues((prevState) => ({...prevState, loading:true }))
    emit(addEmitArgEvent(emitArgs, 'turnchange'))
    setValues((prevState) => ({...prevState, loading:false }))
  }

  const btnFn = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (!emitArgs || styleClass === 'disabled') return
    setValues((prevState) => ({...prevState, loading:true }))

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
      default : break;
    }
  }
  return (
    <div className={style[styleClass]} onClick={(e) => btnFn(e)}>
      {text}
    </div>
  )
}

export default actionBtn
