/**
 **
 * 2と13のカードは同じ数字が手札にあれば、効果を次のユーザーに流すことができる
 * 2か13が出された場合は3秒間ユーザーの入力を待ち、その間に同数値のカードを出すか/出さないかを選択できる
 * 入力がない場合は効果を受け入れると処理し、ゲームが続行する
 */
import { HandCards } from '../../@types/card'
import { Effect } from '../../@types/game'
import {
  isPutOut2or13,
  hasSameCard,
  chkAvoidCardEffect,
  cardsICanPutOut,
  resOpenCardNumbers
} from '../../utils/game/checkHand'
import { initialState } from '../../utils/game/state'

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
    const trash = { card:'s4o', user:initialState.game.board.trash.user }

    const hands1:HandCards[] = ['s1', 'h2', 'c3']
    const result1 = cardsICanPutOut(hands1, trash)
    const expected1 = ['s1']

    const hands2:HandCards[] = ['h2', 'c4']
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
  it('jokerが出された場合、すべてのカードを出す事ができる', async () => {
    const trash = { card: 'x0o', user:initialState.game.board.trash.user }
    const hands:HandCards[] = ['s1', 'h2', 'c3']
    const result = cardsICanPutOut(hands, trash)
    expect(result).toEqual(hands)
  })
  it('手札の8やjokerは、無条件で出すことができる', async () => {
    const trash = { card: 's1o', user:initialState.game.board.trash.user }
    const hands:HandCards[] = ['s2', 'c2', 'h8', 'x0']
    const result = cardsICanPutOut(hands, trash)
    const expected = ['s2', 'h8', 'x0']
    expect(result).toEqual(expected)
  })
  it('wild効果が発動中の場合、指定された柄はどの数字でも出すことができる', async () => {
    const trash = { card: 's8o', user:initialState.game.board.trash.user }
    const hands:HandCards[] = ['s2', 'c2', 'c6', 'h8', 'x0']
    const effect: Effect[] = ['wildclub']
    const result = cardsICanPutOut(hands, trash, effect)
    const expected = ['c2', 'c6', 'h8', 'x0']
    expect(result).toEqual(expected)
  })
})

describe('checkHand TestCases - resOpenCardNumbers', () => {
  it('open状態のカードがなければ空配列で返却', async () => {
    const hands:HandCards[] = ['s2', 'c2', 'c6', 'h8', 'x0']
    const result = resOpenCardNumbers(hands)
    const expected:number[] = []
    expect(result).toEqual(expected)
  })
  it('open状態のカード数字のみ返却する', async () => {
    const hands:HandCards[] = ['s2', 'c2o', 'c6', 'h8o', 'x0o']
    const result = resOpenCardNumbers(hands)
    const expected = [2, 8, 0]
    expect(result).toEqual(expected)
  })
  it('同じ数字があっても別々に返却する', async () => {
    const hands:HandCards[] = ['s2o', 'c2o', 'c6', 'h8o', 'x0o']
    const result = resOpenCardNumbers(hands)
    const expected = [2, 2, 8, 0]
    expect(result).toEqual(expected)
  })
})