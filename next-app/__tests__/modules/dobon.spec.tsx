import { HandCards } from '../../@types/card'
import { DOBON_CARD_NUMBER_DRAW_2, DOBON_CARD_NUMBER_JOKER } from '../../constant'
import { dobonJudge, resReachNumbers } from '../../utils/game/dobonJudge'

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
 ${'s9'}       | ${['x0', 'x1']}             | ${false}
`('手札がJoker(x0もしくはx1)を含む時、Jokerは+1/-1どちらでも合計値に利用できる', ({ putOutCard, hand, expected }) => {
  test(`$putOutCard - $hand returns ${expected}`, () => {
    let result = dobonJudge(putOutCard, hand)
    expect(result).toBe(expected)
  })
})

/**
 * myReachNumbers TestCases
 */
describe.each`
handCards                   | expected
${['s4']}                   | ${{handsLen:1, reachNums:[4]}} // 手札1枚(通常カード)
${['x0']}                   | ${{handsLen:1, reachNums:[DOBON_CARD_NUMBER_JOKER]}} // 手札1枚(ジョーカー)
${['s4', 'h5']}             | ${{handsLen:2, reachNums:[1, 9]}} // 手札2枚(通常カード)、合計差分で上がれる場合
${['s4', 'h4']}             | ${{handsLen:2, reachNums:[8]}} // 手札2枚(通常カード)、合計のみで上がれる場合
${['s4', 'h11']}            | ${{handsLen:2, reachNums:[7]}} // 手札2枚(通常カード)、差分のみで上がれる場合
${['s4', 'x0']}             | ${{handsLen:2, reachNums:[3, 5]}} // 手札2枚(ジョーカー1枚)
${['s1', 'x0']}             | ${{handsLen:2, reachNums:[2]}} // 手札2枚(ジョーカー1枚)、合計のみで上がれる場合
${['s13', 'x0']}            | ${{handsLen:2, reachNums:[12]}} // 手札2枚(ジョーカー1枚)、差分のみで上がれる場合
${['x0', 'x1']}             | ${{handsLen:2, reachNums:[2]}} // 手札2枚(ジョーカー)
${['s10', 's11']}           | ${{handsLen:2, reachNums:[DOBON_CARD_NUMBER_JOKER, 1]}} // 手札2枚(合計が21)
${['s4', 'h5', 'd2']}       | ${{handsLen:3, reachNums:[11]}} // 手札3枚(通常カード)
${['s4', 'x0', 'd2']}       | ${{handsLen:3, reachNums:[5, 7]}} // 手札3枚(ジョーカー1枚)、合計差分で上がれる場合
${['s10', 'd3', 'x0']}      | ${{handsLen:3, reachNums:[12]}} // 手札3枚(ジョーカー1枚)、差分のみで上がれる場合
${['s4', 'x0', 'x1']}       | ${{handsLen:3, reachNums:[2, 4, 6]}} // 手札3枚(ジョーカー2枚)、合計差分で上がれる場合
${['s1', 'x0', 'x1']}       | ${{handsLen:3, reachNums:[1, 3]}} // 手札3枚(ジョーカー2枚)、合計のみで上がれる場合
${['s1', 's9', 's11']}      | ${{handsLen:3, reachNums:[DOBON_CARD_NUMBER_JOKER]}} // 手札3枚(合計が21)
${['s4', 'h5', 'd2', 'd5']} | ${{handsLen:4, reachNums:[]}} // 上がり数値がない場合
`('myReachNumbers TestCases', ({ handCards, expected }) => {
  test(`${handCards} - returns ${expected}`, () => {
    let result = resReachNumbers(handCards)
    expect(result).toEqual(expected)
  })
})

