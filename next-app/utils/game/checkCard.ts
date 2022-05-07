import { HandCards } from "../../@types/card"
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

const extractCardNum = (card: HandCards | string): number | null => {
  const re = /[0-9]+/gui
  const mat = card.match(re)
  return mat ? Number(mat[0]) : null
} 

export { isJoker, existJoker, countJoker, extractCardNum }