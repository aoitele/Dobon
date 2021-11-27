import { Board, Action } from '../../@types/game'
import { HandCards } from '../../@types/card'

const card2 = Number(process.env.NEXT_PUBLIC_RANK_CARD_DRAWTWO)
const card13 = Number(process.env.NEXT_PUBLIC_RANK_CARD_OPENCARD)

const isPutOut2or13 = (putOutCard: number) =>
  [card2, card13].includes(putOutCard)
const hasSameCard = (putOutCard: number, hand: number[]): boolean =>
  hand.includes(putOutCard)
const chkAvoidCardEffect = (action: Action) => action === 'avoidEffect'

const sepalateSuitNum = (cards: Board['hands'] | Board['trash']) => {
  const res = []
  for (let i=0; i<cards.length; i+=1 ){
    const re = /(h|s|c|d|x)([0-9]+)(o|)/u
    const mat = cards[i].match(re)
    if (mat) {
      if (mat[3]) {
        res.push({ suit: mat[1], num: mat[2], isOpen:true })
      } else {
        res.push({ suit: mat[1], num: mat[2] })
      }
    }
  }
  return res
}

const cardsICanPutOut = (hands:HandCards[], trash:Board['trash']) => {
  const handsSep = sepalateSuitNum(hands)
  const trashSep = sepalateSuitNum(trash)
  const { suit, num } = trashSep[0]
  const filteredHands = handsSep.filter(_ => _.suit === suit || _.num === num)
  return filteredHands.map(_=>`${_.suit}${_.num}`)
}

export { isPutOut2or13, hasSameCard, chkAvoidCardEffect, cardsICanPutOut }
