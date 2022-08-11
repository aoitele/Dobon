import { HandCards } from '../../@types/card'
import { CPULevel, OtherHands } from '../../@types/game'
import { culcDobonLisk, DOBONLISK_MAX, DOBONLISK_MIN } from '../../utils/game/cpu/culcDobonLisk'

describe('culcDobonLisk TestCases', () => {
  it('他ユーザーの公開カード合計値を出す場合はリスク最大となる(+100)', () => {
    const card: HandCards = 'c9o'
    const ownHands: HandCards[] = ['c9o']
    const otherHands: OtherHands[] = [
      {userId: 1, hands:['c1o', 'c10o']}, // 9か11を出すとドボンされる
      {userId: 2, hands:['d2', 'c7']},
      {userId: 3, hands:['h4o', 'z', 'z', 'c11o']},
    ]
    const cpuLevel: CPULevel = 'easy'
    const result = culcDobonLisk({card, ownHands, otherHands, cpuLevel})
    expect(result).toBe(DOBONLISK_MAX)
  })
  it('自分がドボン返しを作れる状況であればリスクは最小となる(-100)', () => {
    const card: HandCards = 'c9o'
    const ownHands: HandCards[] = ['c9o', 'c4o', 'c5o'] // 9を出しても4+5でドボン返しになる構成
    const otherHands: OtherHands[] = [
      {userId: 1, hands:['c1o', 'c10o']}, // 9か11を出すとドボンされる
      {userId: 2, hands:['d2', 'c7']},
      {userId: 3, hands:['h4o', 'z', 'z', 'c11o']},
    ]
    const cpuLevel: CPULevel = 'easy'
    const result = culcDobonLisk({card, ownHands, otherHands, cpuLevel})
    expect(result).toBe(DOBONLISK_MIN)
  })
})
