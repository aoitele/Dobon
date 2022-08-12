import { Card, HandCards } from "../../../../../@types/card"
import { OtherHands } from "../../../../../@types/game"
import spreadCardState from "../../../spreadCardState"

export type DeckCards = {
  [key in NonNullable<Card['num']>]: number // eslint-disable-line no-unused-vars
}

/**
 * 過去に出されたカードと他ユーザーの公開手札から
 * 各数字の残り枚数を計算する関数
 */
const resRemainingCard = (
  otherHands: OtherHands[],  // 他ユーザーの手札状態
  trashedMemory: HandCards[] // 現時点で出されているカードの記憶
) => {
  const deck: DeckCards = {
    0  : 2,
    1  : 4,
    2  : 4,
    3  : 4,
    4  : 4,
    5  : 4,
    6  : 4,
    7  : 4,
    8  : 4,
    9  : 4,
    10 : 4,
    11 : 4,
    12 : 4,
    13 : 4,
  }

  const otherHandCards = otherHands.map(item => item.hands).flat()
  const seed = [...trashedMemory, ...otherHandCards]
  const trashNums = spreadCardState(seed).filter(item => item.isOpen).map<keyof DeckCards>(card => card.num)
  for (let i=0; i < trashNums.length; i+=1) {
    const key:keyof DeckCards = trashNums[i]
    deck[key] -= 1
  }

  return deck
}

export { resRemainingCard }