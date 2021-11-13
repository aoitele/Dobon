/**
 * Redisに保存してあるカード情報をフロントエンドで使用する形式に変換する関数
 * 末尾にoがついているカード(公開状態のもの)はそのまま
 * oがついていない非公開カードは裏面カード(suit:'z')にして返却する
 */

import { AllowCardStringType, HandCards } from '../../@types/card'

const spreadCardState = (cards: HandCards[]): AllowCardStringType[] => {
  const res:AllowCardStringType[] = []
  const re = /(h|s|c|d)([0-9]+)(o)/u
  
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