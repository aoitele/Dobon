import { dobonJudge } from '../../utils/game/dobonJudge'

describe('Dobon Judge TestCases', () => {
  it('手札が2枚の時、手札の合計/差分のどちらかが出されたカードと合致すればドボン成功', () => {
    const putOutCard = 's4'
    const hand1 = ['s3', 'd1']
    const hand2 = ['s5', 'h9']
    const hand3 = ['c3', 'h2']

    const result1 = dobonJudge(putOutCard, hand1)
    const result2 = dobonJudge(putOutCard, hand2)
    const result3 = dobonJudge(putOutCard, hand3)

    expect(result1).toBe(true)
    expect(result2).toBe(true)
    expect(result3).toBe(false)
  })
  it('手札が1枚の時、手札が出されたカードと合致すればドボン成功', () => {
    const putOutCard = 's4'
    const hand1 = ['d4']
    const hand2 = ['s5']

    const result1 = dobonJudge(putOutCard, hand1)
    const result2 = dobonJudge(putOutCard, hand2)

    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })
})

describe.each`
putOutCard     | hand                        | expected
 ${'s4'}       | ${['x0', 's3']}             | ${true}
 ${'s4'}       | ${['x0', 's5']}             | ${true}
 ${'s4'}       | ${['x0', 's2', 's1']}       | ${true}
 ${'s4'}       | ${['x1', 's4', 's1']}       | ${true}
 ${'s4'}       | ${['x0', 's2', 's2']}       | ${false}
 ${'s4'}       | ${['x0', 's1', 's1']}       | ${false}
 ${'s4'}       | ${['x0', 'x1', 's2']}       | ${true}
 ${'s4'}       | ${['x0', 'x1', 's4']}       | ${true}
 ${'s4'}       | ${['x0', 'x1', 's6']}       | ${true}
 ${'s6'}       | ${['s4', 's3', 'x0']}       | ${true}
 ${'s11'}      | ${['s4', 's5', 's3', 'x0']} | ${true}
 ${'s12'}      | ${['s4', 's5', 's3', 'x1']} | ${false}
 ${'s13'}      | ${['s4', 's5', 's3', 'x0']} | ${true}
`('手札がJoker(x0もしくはx1)を含む時、Jokerは+1/-1どちらでも合計値に利用できる', ({ putOutCard, hand, expected }) => {
  test(`$putOutCard - $hand returns ${expected}`, () => {
    let result = dobonJudge(putOutCard, hand)
    expect(result).toBe(expected)
  })
})
