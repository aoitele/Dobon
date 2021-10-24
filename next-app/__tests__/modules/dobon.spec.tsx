import { dobonJudge } from '../../utils/game/dobonJudge'

describe('Dobon Judge TestCases', () => {
  it('手札が2枚の時、手札の合計/差分のどちらかが出されたカードと合致すればドボン成功', () => {
    const putOutCard = 4
    const hand1 = [3, 1]
    const hand2 = [5, 9]
    const hand3 = [3, 2]

    const result1 = dobonJudge(putOutCard, hand1)
    const result2 = dobonJudge(putOutCard, hand2)
    const result3 = dobonJudge(putOutCard, hand3)

    expect(result1).toBe(true)
    expect(result2).toBe(true)
    expect(result3).toBe(false)
  })
  it('手札が1枚の時、手札が出されたカードと合致すればドボン成功', () => {
    const putOutCard = 4
    const hand1 = [4]
    const hand2 = [5]

    const result1 = dobonJudge(putOutCard, hand1)
    const result2 = dobonJudge(putOutCard, hand2)

    expect(result1).toBe(true)
    expect(result2).toBe(false)
  }),
    it('手札がJoker(0)を含む時、Jokerは+1/-1どちらでも合計値に利用できる', () => {
      const putOutCard = 4
      const hand1 = [0, 3] // 3 + 1 でドボン
      const hand2 = [0, 5] // 5 - 1 でドボン
      const hand3 = [0, 2, 1] // 3 + 1 でドボン
      const hand4 = [0, 4, 1] // 5 - 1 でドボン
      const hand5 = [0, 2, 2] // 4 +/-1 でドボン失敗
      const hand6 = [0, 1, 1] // 2 +/-1 でドボン失敗
      const hand7 = [0, 0, 2] // 2 + 2 でドボン
      const hand8 = [0, 0, 4] // 4 +/- 0 でドボン
      const hand9 = [0, 0, 6] // 6 - 2 でドボン

      const result1 = dobonJudge(putOutCard, hand1)
      const result2 = dobonJudge(putOutCard, hand2)
      const result3 = dobonJudge(putOutCard, hand3)
      const result4 = dobonJudge(putOutCard, hand4)
      const result5 = dobonJudge(putOutCard, hand5)
      const result6 = dobonJudge(putOutCard, hand6)
      const result7 = dobonJudge(putOutCard, hand7)
      const result8 = dobonJudge(putOutCard, hand8)
      const result9 = dobonJudge(putOutCard, hand9)

      expect(result1).toBe(true)
      expect(result2).toBe(true)
      expect(result3).toBe(true)
      expect(result4).toBe(true)
      expect(result5).toBe(false)
      expect(result6).toBe(false)
      expect(result7).toBe(true)
      expect(result8).toBe(true)
      expect(result9).toBe(true)
    })
})
