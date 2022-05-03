import React, { VFC, useState, useEffect } from 'react'
import { Board } from "../../@types/game";
import { DOBON_CARD_NUMBER_JOKER, DOBON_CARD_NUMBER_OPENCARD } from '../../constant';
import { sum, diff } from '../../utils/game/dobonJudge';
import spreadCardState from '../../utils/game/spreadCardState';
import style from './HintText.module.scss'

interface Props {
  boardState: Board
}

const HintText:VFC<Props> = ({ boardState }) => {
  const [values, setValues] = useState('')
  const { hands, effect } = boardState

  useEffect(() => {
    if (hands.length === 0) return
    // Jokerが場に出た時は優先してヒントを表示
    if (effect.includes('joker')) {
      setValues(`手札合計：${DOBON_CARD_NUMBER_JOKER}ならドボン可能！`)
      return
    }

    const nums: number[] = spreadCardState(hands, true).map(hand => hand.num)
    const sumIsBelow13 = sum(nums) <= DOBON_CARD_NUMBER_OPENCARD // 手札合計が13以下か
    const diffIsNot0 = diff(nums[0], nums[1]) !== 0              // 手札差分が0でないか

    let text = ''
    switch(nums.length) {
      case 1: {
        text = `${nums[0]}でドボン待ち(単騎x2ボーナス)`
        break
      }
      case 2: {
        if (sumIsBelow13 && diffIsNot0) text = `${sum(nums)} or ${diff(nums[0], nums[1])}でドボン待ち`
        else if (sumIsBelow13)          text = `${sum(nums)}でドボン待ち`
        else if (diffIsNot0)            text = `${diff(nums[0], nums[1])}でドボン待ち`
        break
      }
      default: {
        if (sumIsBelow13) text = `${sum(nums)}でドボン待ち`
        break
      }
    }
    setValues(text)
  },[hands, effect])

  return (
  <div className={style.hint}>
    <span className={style.hintTxt}>{values}</span>
  </div>
  )
}

export default HintText