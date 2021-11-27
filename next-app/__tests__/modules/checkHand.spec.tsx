/**
 **
 * 2と13のカードは同じ数字が手札にあれば、効果を次のユーザーに流すことができる
 * 2か13が出された場合は3秒間ユーザーの入力を待ち、その間に同数値のカードを出すか/出さないかを選択できる
 * 入力がない場合は効果を受け入れると処理し、ゲームが続行する
 */
import { HandCards } from '../../@types/card'
import {
  isPutOut2or13,
  hasSameCard,
  chkAvoidCardEffect,
  cardsICanPutOut
} from '../../utils/game/checkHand'

describe('checkHand TestCases', () => {
  it('2か13が出されたか', () => {
    const putOutCard1 = 2
    const putOutCard2 = 11
    const putOutCard3 = 13
    const putOutCard4 = 0

    const result1 = isPutOut2or13(putOutCard1)
    const result2 = isPutOut2or13(putOutCard2)
    const result3 = isPutOut2or13(putOutCard3)
    const result4 = isPutOut2or13(putOutCard4)

    expect(result1).toBe(true)
    expect(result2).toBe(false)
    expect(result3).toBe(true)
    expect(result4).toBe(false)
  })
  it('出されたカードと同じ数字のカードが手札にあるか', () => {
    const putOutCard = 4
    const hand1 = [3, 1, 4]
    const hand2 = [5, 9]

    const result1 = hasSameCard(putOutCard, hand1)
    const result2 = hasSameCard(putOutCard, hand2)

    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })
  it('2か13が出された時、同数字を出す指示が出た', async () => {
    expect.assertions(1)
    const result = chkAvoidCardEffect('avoidEffect')
    expect(result).toBe(true)
  })
  it('2か13が出された時、同数字を出さない指示が出た', async () => {
    expect.assertions(1)
    const result = chkAvoidCardEffect('notAvoidEffect')
    expect(result).toBe(false)
  })
  it('柄か数字が同じカードが存在する場合、そのカードは出す事ができる', async () => {
    const trash = ['s4o']

    const hands1:HandCards[] = ['s1', 'h2', 'c3']
    const result1 = cardsICanPutOut(hands1, trash)
    const expected1 = ['s1']

    const hands2:HandCards[] = ['x0', 'h2', 'c4']
    const result2 = cardsICanPutOut(hands2, trash)
    const expected2 = ['c4']

    const hands3:HandCards[] = ['s2', 'h2', 'c4']
    const result3 = cardsICanPutOut(hands3, trash)
    const expected3 = ['s2', 'c4']

    const hands4:HandCards[] = ['h2', 'h3', 'c1']
    const result4 = cardsICanPutOut(hands4, trash)
    const expected4:any[] = []

    expect(result1).toEqual(expected1)
    expect(result2).toEqual(expected2)
    expect(result3).toEqual(expected3)
    expect(result4).toEqual(expected4)
  })
})
