import React, { VFC, useState, useEffect } from 'react'
import { Board } from "../../@types/game";
import { DOBON_JUDGE_NUMBER_JOKER, DOBON_CARD_NUMBER_OPENCARD } from '../../constant';
import { isJoker, countJoker } from '../../utils/game/checkCard';
import { sum, diff, resNumArrayExcludeJoker } from '../../utils/game/dobonJudge';
import style from './HintText.module.scss'

interface Props {
  boardState: Board
}

/**
 * 「自分の待ち数字」を計算してヒントを表示するUIパーツ
 * 手札が1枚    - 単騎待ち(持っているカードの数字のみ)
 * 手札が2枚    - 合計or差分待ち
 * 手札が3枚以上 - 合計待ち
 * Jokerは+/-1どちらにも利用できる
 */
const HintText:VFC<Props> = ({ boardState }) => {
  const [values, setValues] = useState('')
  const { hands, effect } = boardState

  useEffect(() => {
    if (hands.length === 0) return
    // Jokerが場に出た時は優先してヒントを表示
    if (effect.includes('joker')) {
      setValues(`手札合計：${DOBON_JUDGE_NUMBER_JOKER}ならドボン成功！`)
      return
    }
    const hasJokerCount = countJoker(hands)

    let text = ''
    if (hands.length === hasJokerCount) {
      text = hasJokerCount === 1 ? 'ジョーカーでドボン待ち(単騎x2ボーナス)' : ''
      setValues(text)
      return
    }

    const nums = resNumArrayExcludeJoker(hands) // Jokerを除いた手札
    const sumIsBelow13 = sum(nums) + hasJokerCount <= DOBON_CARD_NUMBER_OPENCARD // 手札合計が13以下か

    switch(hands.length) {
      // 手札が1枚
      case 1: {
        text = isJoker(hands[0]) ? `ジョーカーでドボン待ち(単騎x2ボーナス)` : `${nums[0]}でドボン待ち(単騎x2ボーナス)`
        break
      }
      // 手札が2枚
      case 2: {
        let diffIsNot0 = false

        // Jokerをもっていない場合
        if (hasJokerCount === 0) {
          const diffNum = diff(nums[0], nums[1])
          diffIsNot0 = diffNum !== 0
          if (sumIsBelow13 && diffIsNot0) text = `${sum(nums)} or ${diffNum}でドボン待ち`
          else if (sumIsBelow13)          text = `${sum(nums)}でドボン待ち`
          else if (diffIsNot0)            text = `${diffNum}でドボン待ち`
        }

        // Jokerを1枚持っている場合
        if (hasJokerCount === 1) {
          diffIsNot0 = nums[0] !== 1
          if (sumIsBelow13 && diffIsNot0) text = `${nums[0] + 1} or ${nums[0] - 1}でドボン待ち`
          else if (sumIsBelow13)          text = `${nums[0] + 1}でドボン待ち`
          else if (diffIsNot0)            text = `${nums[0] - 1}でドボン待ち`
        }

        // Jokerを2枚持っている場合
        if (hasJokerCount === 2) {
          text = `${hasJokerCount}でドボン待ち`
        }
        break
      }
      // 手札が3枚以上
      default: {
        if (hasJokerCount === 0) {
          if (sumIsBelow13) text = `${sum(nums)}でドボン待ち`
        }

        const baseNum = sum(nums)
        // Jokerを1枚持っている場合
        if (hasJokerCount === 1) {
          if (sumIsBelow13)        text = `${baseNum - 1} or ${baseNum + 1}でドボン待ち`
          else if (baseNum === 13 || baseNum === 14) text = `${baseNum - 1}でドボン待ち`
        }
        // Jokerを2枚持っている場合
        if (hasJokerCount === 2) {
          if (baseNum <= 2)                          text = `${baseNum} or ${baseNum + 2}でドボン待ち`
          else if (baseNum === 14 || baseNum === 15) text = `${baseNum - 2}でドボン待ち`
          else if (sumIsBelow13)                     text = `${baseNum - 2} or ${baseNum} or ${baseNum + 2}でドボン待ち`
        }
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