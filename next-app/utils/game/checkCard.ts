import { HandCards } from "../../@types/card"
import { DOBON_CARD_NUMBER_REVERSE } from "../../constant"
import { HandSep, sepalateSuitNum } from "./checkHand"
import spreadCardState from "./spreadCardState"

const isJoker = (card: HandCards | string) => {
  const _card = spreadCardState([card], true)
  return _card[0].suit === 'x'
}
const existJoker = (cards: HandCards[] | string[]) => {
  const _cards = spreadCardState(cards, true)
  return _cards.filter(card => card.suit === 'x').length > 0
}
const countJoker = (cards: HandCards[] | string[]) => {
  const _cards = spreadCardState(cards, true)
  return _cards.filter(card => card.suit === 'x').length
}

const countFaceCards = ({ cards, openOnly }: {
  cards: HandCards[] | string[],
  openOnly: boolean
}) => {
  let sepalatedInfoCards = sepalateSuitNum(cards)
  if (openOnly) {
    sepalatedInfoCards = sepalatedInfoCards.filter(card => card.isOpen)
  }
  const isFaceCard = (card: HandSep) =>  Number(card.num) >= DOBON_CARD_NUMBER_REVERSE || card.suit === 'x'

  return sepalatedInfoCards.filter(item => isFaceCard(item)).length
}

const extractCardNum = (card: HandCards | string): number | null => {
  const re = /[0-9]+/gui
  const mat = card.match(re)
  return mat ? Number(mat[0]) : null
} 

export { isJoker, existJoker, countJoker, countFaceCards, extractCardNum }