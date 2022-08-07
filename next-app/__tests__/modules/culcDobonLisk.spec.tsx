import { HandCards } from '../../@types/card'
import { OtherHands } from '../../@types/game'
import { culcDobonLisk } from '../../utils/game/cpu/culcDobonLisk'

describe('culcDobonLisk TestCases', () => {
  it('他ユーザーの公開カード合計値を出す場合はリスク最大となる(+100)', () => {
    const card: HandCards = 'c9o'
    const otherHands: OtherHands[] = [
      {userId: 1, hands:['c1o', 'c10o']}, // 9か11を出すとドボンされる
      {userId: 2, hands:['d2', 'c7']},
      {userId: 3, hands:['h4o', 'z', 'z', 'c11o']},
    ]
    const result = culcDobonLisk(card, otherHands, 'easy')
    expect(result).toBe(100)
  })
})
