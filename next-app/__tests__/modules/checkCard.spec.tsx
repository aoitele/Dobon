/**
 * 2と13のカードは同じ数字が手札にあれば、効果を次のユーザーに流すことができる
 * 2か13が出された場合は3秒間ユーザーの入力を待ち、その間に同数値のカードを出すか/出さないかを選択できる
 * 入力がない場合は効果を受け入れると処理し、ゲームが続行する
 */
import { isJoker, existJoker, countJoker, extractCardNum, countFaceCards } from '../../utils/game/checkCard'
 
const CARD_NOJOKER = 's1'
const CARD_JOKER_X0 = 'x0'
const CARD_JOKER_X0_OPEN = 'x0o'
const CARD_JOKER_X1 = 'x1'
const CARD_JOKER_X1_OPEN = 'x1o'

const HAND_NOJOKER = ['s1', 's2', 's3']
const HAND_NOJOKER_OPEN = ['s1o', 's2o', 's3o']
const HAND_JOKER_X0 = ['s1', 'x0', 's3']
const HAND_JOKER_X0_OPEN = ['s1o', 'x0o', 's3o']
const HAND_JOKER_X1 = ['s1', 's2', 'x1']
const HAND_JOKER_X1_OPEN = ['s1o', 's2o', 'x1o']
const HAND_TWO_JOKER = ['s1', 'x0', 'x1']
const HAND_TWO_JOKER_ONLY = ['x0', 'x1']
const HAND_TWO_JOKER_OPEN = ['s1o', 'x0o', 'x1o']
const HAND_HAS_ONE_FACE = ['s1', 's2', 's11']
const HAND_HAS_ONE_FACE_OPEN = ['s1', 's2', 's11o']
const HAND_HAS_TWO_FACE = ['s1', 's11', 's12']
const HAND_HAS_TWO_FACE_OPEN = ['s1', 's11o', 's12o']
const HAND_HAS_TWO_FACE_HALF_OPEN = ['s1', 's11', 's12o']

describe('checkCard TestCases', () => {
  it('isJoker: ジョーカーカードかどうか', () => {
    expect(isJoker(CARD_NOJOKER)).toBe(false)
    expect(isJoker(CARD_JOKER_X0)).toBe(true)
    expect(isJoker(CARD_JOKER_X0_OPEN)).toBe(true)
    expect(isJoker(CARD_JOKER_X1)).toBe(true)
    expect(isJoker(CARD_JOKER_X1_OPEN)).toBe(true)
  })
  it('existJoker: 手札にジョーカーがあるかどうか', () => {
    expect(existJoker(HAND_NOJOKER)).toBe(false)
    expect(existJoker(HAND_NOJOKER_OPEN)).toBe(false)
    expect(existJoker(HAND_JOKER_X0)).toBe(true)
    expect(existJoker(HAND_JOKER_X0_OPEN)).toBe(true)
    expect(existJoker(HAND_JOKER_X1)).toBe(true)
    expect(existJoker(HAND_JOKER_X1_OPEN)).toBe(true)
    expect(existJoker(HAND_TWO_JOKER)).toBe(true)
    expect(existJoker(HAND_TWO_JOKER_OPEN)).toBe(true)
  })
  it('countJoker: ジョーカーの枚数をカウント', async () => {
    expect(countJoker(HAND_NOJOKER)).toBe(0)
    expect(countJoker(HAND_JOKER_X0)).toBe(1)
    expect(countJoker(HAND_JOKER_X1)).toBe(1)
    expect(countJoker(HAND_TWO_JOKER)).toBe(2)
    expect(countJoker(HAND_TWO_JOKER_ONLY)).toBe(2)
  })
  it('extractCardNum: カードから数字を取り出す', async () => {
    expect(extractCardNum(CARD_NOJOKER)).toBe(1)
    expect(extractCardNum('10')).toBe(10)
    expect(extractCardNum(CARD_JOKER_X0)).toBe(0)
    expect(extractCardNum(CARD_JOKER_X1)).toBe(1)
  })
  it('countFaceCards: 絵札の枚数をカウント - クローズカードも含む', () => {
    const openOnly = false
    expect(countFaceCards({ cards:[], openOnly })).toBe(0)
    expect(countFaceCards({ cards:HAND_NOJOKER, openOnly })).toBe(0)
    expect(countFaceCards({ cards:HAND_JOKER_X0, openOnly })).toBe(1)
    expect(countFaceCards({ cards:HAND_JOKER_X0_OPEN, openOnly })).toBe(1)
    expect(countFaceCards({ cards:HAND_JOKER_X1, openOnly })).toBe(1)
    expect(countFaceCards({ cards:HAND_JOKER_X1_OPEN, openOnly })).toBe(1)
    expect(countFaceCards({ cards:HAND_HAS_ONE_FACE, openOnly })).toBe(1)
    expect(countFaceCards({ cards:HAND_HAS_ONE_FACE_OPEN, openOnly })).toBe(1)
    expect(countFaceCards({ cards:HAND_HAS_TWO_FACE, openOnly })).toBe(2)
    expect(countFaceCards({ cards:HAND_HAS_TWO_FACE_OPEN, openOnly })).toBe(2)
    expect(countFaceCards({ cards:HAND_HAS_TWO_FACE_HALF_OPEN, openOnly })).toBe(2)
  })
  it('countFaceCards: 絵札の枚数をカウント - オープンカードのみ', () => {
    const openOnly = true
    expect(countFaceCards({ cards:[], openOnly })).toBe(0)
    expect(countFaceCards({ cards:HAND_NOJOKER, openOnly })).toBe(0)
    expect(countFaceCards({ cards:HAND_JOKER_X0, openOnly })).toBe(0)
    expect(countFaceCards({ cards:HAND_JOKER_X0_OPEN, openOnly })).toBe(1)
    expect(countFaceCards({ cards:HAND_JOKER_X1, openOnly })).toBe(0)
    expect(countFaceCards({ cards:HAND_JOKER_X1_OPEN, openOnly })).toBe(1)
    expect(countFaceCards({ cards:HAND_HAS_ONE_FACE, openOnly })).toBe(0)
    expect(countFaceCards({ cards:HAND_HAS_ONE_FACE_OPEN, openOnly })).toBe(1)
    expect(countFaceCards({ cards:HAND_HAS_TWO_FACE, openOnly })).toBe(0)
    expect(countFaceCards({ cards:HAND_HAS_TWO_FACE_OPEN, openOnly })).toBe(2)
    expect(countFaceCards({ cards:HAND_HAS_TWO_FACE_HALF_OPEN, openOnly })).toBe(1)
  })
})
 