import { isMyTurnFn, isNextUserTurnFn, culcNextUserTurn, culcBeforeUserTurn } from '../../utils/game/turnInfo'
import { Player } from '../../@types/game'

const noInfoUser = { id: 0, nickname: '', turn: 0, score: 0, isWinner: false, isLoser: false }

describe('turnInfo TestCases', () => {
  it('isMyTurn:自分のターンかどうか', () => {
    const me: Player = {
      id: 1,
      nickname: 'taro',
      turn: 1,
      score: 0,
      isWinner: false,
      isLoser: false
    }
    const turnUser__me: Player = {
      id: 1,
      nickname: 'taro',
      turn: 1,
      score: 0,
      isWinner: false,
      isLoser: false
    }
    const turnUser__other: Player = {
      id: 2,
      nickname: 'jiro',
      turn: 2,
      score: 0,
      isWinner: false,
      isLoser: false
    }

    const result1 = isMyTurnFn(me, turnUser__me)
    const result2 = isMyTurnFn(me, turnUser__other)

    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })
  it('isNextUserTurn:自分の次のユーザーのターンかどうか', () => {
    const users: Player[] = [
      { id: 1, nickname: 'taro', turn: 1, score: 0, isWinner: false, isLoser: false },
      { id: 2, nickname: 'jiro', turn: 2, score: 0, isWinner: false, isLoser: false },
      { id: 3, nickname: 'saburo', turn: 3, score: 0, isWinner: false, isLoser: false },
      { id: 4, nickname: 'siro', turn: 4, score: 0, isWinner: false, isLoser: false },
    ]

    const me1 = users.find(_ => _.nickname === 'taro') ?? noInfoUser
    const turnUser1 = users.find(_ => _.nickname === 'jiro') ?? noInfoUser
    const result1 = isNextUserTurnFn(me1, turnUser1, users)

    const me2 = users.find(_ => _.nickname === 'taro') ?? noInfoUser
    const turnUser2 = users.find(_ => _.nickname === 'saburo') ?? noInfoUser
    const result2 = isNextUserTurnFn(me2, turnUser2, users)

    const me3 = users.find(_ => _.nickname === 'siro') ?? noInfoUser
    const turnUser3 = users.find(_ => _.nickname === 'taro') ?? noInfoUser
    const result3 = isNextUserTurnFn(me3, turnUser3, users)

    const me4 = users.find(_ => _.nickname === 'siro') ?? noInfoUser
    const turnUser4 = users.find(_ => _.nickname === 'saburo') ?? noInfoUser
    const result4 = isNextUserTurnFn(me4, turnUser4, users)

    expect(result1).toBe(true)
    expect(result2).toBe(false)
    expect(result3).toBe(true)
    expect(result4).toBe(false)
  })
})

const users: Player[] = [
  { id: 1, nickname: 'taro', turn: 1, score: 0, isWinner: false, isLoser: false },
  { id: 2, nickname: 'jiro', turn: 2, score: 0, isWinner: false, isLoser: false },
  { id: 3, nickname: 'saburo', turn: 3, score: 0, isWinner: false, isLoser: false },
  { id: 4, nickname: 'siro', turn: 4, score: 0, isWinner: false, isLoser: false },
]

const user2 = users.slice(0, 2)
const user3 = users.slice(0, 3)
const user4 = users.slice(0, 4)

describe.each`
 turn  | users    | effect       | isReversed | expected
 ${1}  | ${user2} | ${undefined} | ${false} | ${2}
 ${1}  | ${user2} | ${'skip'}    | ${false} | ${1}
 ${1}  | ${user2} | ${'reverse'} | ${false} | ${2}
 ${2}  | ${user2} | ${undefined} | ${false} | ${1}
 ${2}  | ${user2} | ${'skip'}    | ${false} | ${2}
 ${2}  | ${user2} | ${'reverse'} | ${false} | ${1}
 ${1}  | ${user3} | ${undefined} | ${false} | ${2}
 ${3}  | ${user3} | ${undefined} | ${false} | ${1}
 ${1}  | ${user3} | ${'skip'}    | ${false} | ${3}
 ${2}  | ${user3} | ${'skip'}    | ${false} | ${1}
 ${1}  | ${user3} | ${'reverse'} | ${false} | ${3}
 ${2}  | ${user3} | ${'reverse'} | ${false} | ${1}
 ${1}  | ${user4} | ${undefined} | ${false} | ${2}
 ${4}  | ${user4} | ${undefined} | ${false} | ${1}
 ${1}  | ${user4} | ${'skip'}    | ${false} | ${3}
 ${2}  | ${user4} | ${'skip'}    | ${false} | ${4}
 ${3}  | ${user4} | ${'skip'}    | ${false} | ${1}
 ${4}  | ${user4} | ${'skip'}    | ${false} | ${2}
 ${1}  | ${user4} | ${'reverse'} | ${false} | ${4}
 ${2}  | ${user4} | ${'reverse'} | ${false} | ${1}
 ${3}  | ${user4} | ${'reverse'} | ${false} | ${2}
 ${4}  | ${user4} | ${'reverse'} | ${false} | ${3}
 ${1}  | ${user2} | ${undefined} | ${true}  | ${2}
 ${1}  | ${user2} | ${'skip'}    | ${true}  | ${1}
 ${1}  | ${user2} | ${'reverse'} | ${true}  | ${2}
 ${2}  | ${user2} | ${undefined} | ${true}  | ${1}
 ${2}  | ${user2} | ${'skip'}    | ${true}  | ${2}
 ${2}  | ${user2} | ${'reverse'} | ${true}  | ${1}
 ${1}  | ${user3} | ${undefined} | ${true}  | ${3}
 ${3}  | ${user3} | ${undefined} | ${true}  | ${2}
 ${1}  | ${user3} | ${'skip'}    | ${true}  | ${2}
 ${2}  | ${user3} | ${'skip'}    | ${true}  | ${3}
 ${1}  | ${user3} | ${'reverse'} | ${true}  | ${2}
 ${2}  | ${user3} | ${'reverse'} | ${true}  | ${3}
 ${1}  | ${user4} | ${undefined} | ${true}  | ${4}
 ${4}  | ${user4} | ${undefined} | ${true}  | ${3}
 ${1}  | ${user4} | ${'skip'}    | ${true}  | ${3}
 ${2}  | ${user4} | ${'skip'}    | ${true}  | ${4}
 ${3}  | ${user4} | ${'skip'}    | ${true}  | ${1}
 ${4}  | ${user4} | ${'skip'}    | ${true}  | ${2}
 ${1}  | ${user4} | ${'reverse'} | ${true}  | ${2}
 ${2}  | ${user4} | ${'reverse'} | ${true}  | ${3}
 ${3}  | ${user4} | ${'reverse'} | ${true}  | ${4}
 ${4}  | ${user4} | ${'reverse'} | ${true}  | ${1}
`('$turn should be', ({ turn, users, effect, isReversed, expected }) => {
  test(`returns ${expected}`, () => {
    expect(culcNextUserTurn(turn, users, effect, isReversed)).toBe(expected)
  })
})

/**
 * culcBeforeUserTurn TestCases
 * isReversed false - turnに-1(結果が0なら最後のユーザーとなる)
 * isReversed true  - turnに+1(結果がユーザー数+1なら最初のユーザーとなる)
 */
describe.each`
 turn  | users    | isReversed | expected
 ${1}  | ${user2} | ${false}   | ${2}
 ${2}  | ${user2} | ${false}   | ${1}
 ${1}  | ${user2} | ${true}    | ${2}
 ${2}  | ${user2} | ${true}    | ${1}
 ${1}  | ${user3} | ${false}   | ${3}
 ${2}  | ${user3} | ${false}   | ${1}
 ${3}  | ${user3} | ${false}   | ${2}
 ${1}  | ${user3} | ${true}    | ${2}
 ${2}  | ${user3} | ${true}    | ${3}
 ${3}  | ${user3} | ${true}    | ${1}
 ${1}  | ${user4} | ${false}   | ${4}
 ${2}  | ${user4} | ${false}   | ${1}
 ${3}  | ${user4} | ${false}   | ${2}
 ${4}  | ${user4} | ${false}   | ${3}
 ${1}  | ${user4} | ${true}    | ${2}
 ${2}  | ${user4} | ${true}    | ${3}
 ${3}  | ${user4} | ${true}    | ${4}
 ${4}  | ${user4} | ${true}    | ${1}
`('$turn should be', ({ turn, users, isReversed, expected }) => {
  test(`returns ${expected}`, () => {
    expect(culcBeforeUserTurn(turn, users, isReversed)).toBe(expected)
  })
})