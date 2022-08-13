import { HandCards } from '../../@types/card'
import { OtherHands } from '../../@types/game'
import { culcDobonRisk } from '../../utils/game/cpu/thinking/putout/culcDobonRisk'
import { DobonRiskReturnValue, DOBONRISK_MAX, DOBONRISK_MEDIAN, DOBONRISK_MIN } from '../../utils/game/cpu/thinking/putout/main'
import { DeckCards, resRemainingCard } from '../../utils/game/cpu/thinking/putout/resRemainingCard'

describe('culcDobonRisk TestCases', () => {
  it('他ユーザーの公開カード合計値を出す場合はリスク最大となる(+101)', () => {
    const ownHands: HandCards[] = ['c9o']
    const otherHands: OtherHands[] = [
      {userId: 1, hands:['c1o', 'c10o']}, // 9か11を出すとドボンされる
      {userId: 2, hands:['d2', 'c7']},
      {userId: 3, hands:['h4o', 'z', 'z', 'c11o']},
    ]
    const defineRiskCards: number[] = [9, 11]
    const trashedMemory:HandCards[] = []
    const remainingCard:DeckCards = resRemainingCard(otherHands, trashedMemory)

    const expected: DobonRiskReturnValue = [
      { card: 'c9o', dobonRisk: DOBONRISK_MAX}
    ]
    const result = culcDobonRisk({ownHands, otherHands, defineRiskCards, remainingCard})
    expect(result).toEqual(expected)
  })
  it('自分がドボン返しを作れる状況であればリスクは最小となる(-101)', () => {
    const ownHands: HandCards[] = ['c9o', 'c1o', 'c3o', 'd5o'] // 'c9o'を出すとドボン返しになる構成
    const otherHands: OtherHands[] = [
      {userId: 1, hands:['c1o', 'c10o']}, // 9か11を出すとドボンされる
      {userId: 2, hands:['d2', 'c7']},
      {userId: 3, hands:['h4o', 'z', 'z', 'c11o']},
    ]
    const defineRiskCards: number[] = [9, 11]
    const trashedMemory:HandCards[] = []
    const remainingCard:DeckCards = resRemainingCard(otherHands, trashedMemory)

    const expected: DobonRiskReturnValue = [
      { card: 'c9o', dobonRisk: DOBONRISK_MIN},
      { card: 'c1o', dobonRisk: DOBONRISK_MEDIAN},
      { card: 'c3o', dobonRisk: DOBONRISK_MEDIAN},
      { card: 'd5o', dobonRisk: DOBONRISK_MEDIAN},
    ]
    const result = culcDobonRisk({ownHands, otherHands, defineRiskCards, remainingCard})
    expect(result).toEqual(expected)
  })
  it('自分がドボン返しを作れる状況であればリスクは最小となる(全カードが-101)', () => {
    const ownHands: HandCards[] = ['c9o', 'c4o', 'c5o'] // いずれを出してもドボン返しになる構成
    const otherHands: OtherHands[] = [
      {userId: 1, hands:['c1o', 'c10o']}, // 9か11を出すとドボンされる
      {userId: 2, hands:['d2', 'c7']},
      {userId: 3, hands:['h4o', 'z', 'z', 'c11o']},
    ]
    const defineRiskCards: number[] = [9, 11]
    const trashedMemory:HandCards[] = []
    const remainingCard:DeckCards = resRemainingCard(otherHands, trashedMemory)

    const expected: DobonRiskReturnValue = [
      { card: 'c9o', dobonRisk: DOBONRISK_MIN},
      { card: 'c4o', dobonRisk: DOBONRISK_MIN},
      { card: 'c5o', dobonRisk: DOBONRISK_MIN},
    ]
    const result = culcDobonRisk({ownHands, otherHands, defineRiskCards, remainingCard})
    expect(result).toEqual(expected)
  })
})
