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
  })
})

describe.each`
putOutCard  | hand            | expected
 ${4}       | ${[0, 3]}       | ${true}
 ${4}       | ${[0, 5]}       | ${true}
 ${4}       | ${[0, 2, 1]}    | ${true}
 ${4}       | ${[0, 4, 1]}    | ${true}
 ${4}       | ${[0, 2, 2]}    | ${false}
 ${4}       | ${[0, 1, 1]}    | ${false}
 ${4}       | ${[0, 0, 2]}    | ${true}
 ${4}       | ${[0, 0, 4]}    | ${true}
 ${4}       | ${[0, 0, 6]}    | ${true}
 ${6}       | ${[4, 3, 0]}    | ${true}
 ${11}      | ${[4, 5, 3, 0]} | ${true}
 ${12}      | ${[4, 5, 3, 0]} | ${false}
 ${13}      | ${[4, 5, 3, 0]} | ${true}
`('手札がJoker(0)を含む時、Jokerは+1/-1どちらでも合計値に利用できる', ({ putOutCard, hand, expected }) => {
  test(`$putOutCard - $hand returns ${expected}`, () => {
    let result = dobonJudge(putOutCard, hand)
    expect(result).toBe(expected)
  })
})
