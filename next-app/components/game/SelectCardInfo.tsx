import React from 'react'
import { InitialBoardState } from '../../@types/game'
import spreadCardState from '../../utils/game/spreadCardState'
import style from './SelectCardInfo.module.scss'

interface Props {
  states: {
    values: InitialBoardState
  }
}

const info = new Map()
info.set(0, 'joker\n次の人はどのカードでも出せます/全員は手札合計23でどぼんができます')
info.set(1, 'skip\n次の人をスキップします')
info.set(2, 'draw2\n次の人にカードを2枚引かせます')
info.set(8, 'wild\n次の人は選択した柄のカードが自由に出せます')
info.set(11, 'reverse\nターンの順番が逆になります')
info.set(13, 'opencard\n次の人は手札を公開状態にします')

const selectSuit:React.FC<Props> = ({ states }) => {
  const cardNum = spreadCardState([states.values.selectedCard], true)[0].num
  return (
    <div className={style.wrap}>
        <p className={style.txt}>{info.get(cardNum)}</p>
    </div>
  )
}

export default selectSuit