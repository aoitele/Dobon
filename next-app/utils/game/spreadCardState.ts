/**
 * Redisに保存してあるカード情報をフロントエンドで使用する形式に変換する関数
 * 
 * 自札の場合：形式を変えるのみ
 * 
 * 他ユーザーの手札の場合：
 * 末尾にoがついているカード(公開状態のもの)はそのまま
 * oがついていない非公開カードは裏面カード(suit:'z')にして返却する
 */

import { AllowCardStringType, HandCards } from '../../@types/card'

const spreadCardState = (cards: string[] | HandCards[], isMyCard?: boolean): AllowCardStringType[] => {
  const res:AllowCardStringType[] = []
  const re = isMyCard ? /(h|s|c|d)([0-9]+)/u : /(h|s|c|d)([0-9]+)(o)/u
  
  for (let i=0; i<cards.length; i+=1 ){
    const mat = cards[i].match(re)
    if (mat && mat.length) {
      res.push({ suit: mat[1], num: Number(mat[2]), isOpen: true})
    } else {
      res.push({ suit: 'z', num: null, isOpen: false})
    }
  }
  return res
}
export default spreadCardState