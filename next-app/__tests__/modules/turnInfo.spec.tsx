import { isMyTurnFn, isNextUserTurnFn, culcNextUserTurn, culcBeforeUserTurn } from '../../utils/game/turnInfo'
import { Player } from '../../@types/game'

// 全ユーザー情報
const users: Player[] = [
  { id: 1, nickname: 'taro', turn: 1, score: 0, isWinner: false, isLoser: false },
  { id: 2, nickname: 'jiro', turn: 2, score: 0, isWinner: false, isLoser: false },
  { id: 3, nickname: 'saburo', turn: 3, score: 0, isWinner: false, isLoser: false },
  { id: 4, nickname: 'siro', turn: 4, score: 0, isWinner: false, isLoser: false },
]

const user1 = users[0] // taro
const user2 = users[1] // jiro
const user3 = users[2] // saburo
const user4 = users[3] // siro

const users2 = users.slice(0, 2) // 参加者2人の場合
const users3 = users.slice(0, 3) // 参加者3人の場合
const users4 = users.slice(0, 4) // 参加者4人の場合

describe('turnInfo TestCases', () => {
  it('isMyTurn:自分のターンかどうか', () => {
    const result1 = isMyTurnFn(user1, user1)
    const result2 = isMyTurnFn(user1, user2)

    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })
})

describe.each`
me        | turnUser    | users         | isReversed | expected
${user1}  | ${user2}    | ${users2}     | ${false}   | ${true}
${user1}  | ${user3}    | ${users3}     | ${false}   | ${false}
${user1}  | ${user4}    | ${users4}     | ${false}   | ${false}
${user1}  | ${user2}    | ${users2}     | ${true}    | ${true}
${user1}  | ${user3}    | ${users3}     | ${true}    | ${true}
${user1}  | ${user4}    | ${users4}     | ${true}    | ${true}
${user2}  | ${user1}    | ${users2}     | ${false}   | ${true}
${user2}  | ${user1}    | ${users3}     | ${false}   | ${false}
${user2}  | ${user3}    | ${users3}     | ${false}   | ${true}
${user2}  | ${user1}    | ${users4}     | ${false}   | ${false}
${user2}  | ${user3}    | ${users4}     | ${false}   | ${true}
${user2}  | ${user4}    | ${users4}     | ${false}   | ${false}
${user2}  | ${user1}    | ${users2}     | ${true}    | ${true}
${user2}  | ${user1}    | ${users3}     | ${true}    | ${true}
${user2}  | ${user3}    | ${users3}     | ${true}    | ${false}
${user2}  | ${user1}    | ${users4}     | ${true}    | ${true}
${user2}  | ${user3}    | ${users4}     | ${true}    | ${false}
${user2}  | ${user4}    | ${users4}     | ${true}    | ${false}
`('isNextUserTurn:自分の次のユーザーのターンかどうか', ({ me, turnUser, users, isReversed, expected }) => {
  test(`returns ${expected}`, () => {
    expect(isNextUserTurnFn(me, turnUser, users, isReversed)).toBe(expected)
  })
})

describe.each`
 turn  | users     | effect       | isReversed | expected
 ${1}  | ${users2} | ${undefined} | ${false}   | ${2}
 ${1}  | ${users2} | ${'skip'}    | ${false}   | ${1}
 ${1}  | ${users2} | ${'reverse'} | ${false}   | ${2}
 ${2}  | ${users2} | ${undefined} | ${false}   | ${1}
 ${2}  | ${users2} | ${'skip'}    | ${false}   | ${2}
 ${2}  | ${users2} | ${'reverse'} | ${false}   | ${1}
 ${1}  | ${users3} | ${undefined} | ${false}   | ${2}
 ${3}  | ${users3} | ${undefined} | ${false}   | ${1}
 ${1}  | ${users3} | ${'skip'}    | ${false}   | ${3}
 ${2}  | ${users3} | ${'skip'}    | ${false}   | ${1}
 ${1}  | ${users3} | ${'reverse'} | ${false}   | ${3}
 ${2}  | ${users3} | ${'reverse'} | ${false}   | ${1}
 ${1}  | ${users4} | ${undefined} | ${false}   | ${2}
 ${4}  | ${users4} | ${undefined} | ${false}   | ${1}
 ${1}  | ${users4} | ${'skip'}    | ${false}   | ${3}
 ${2}  | ${users4} | ${'skip'}    | ${false}   | ${4}
 ${3}  | ${users4} | ${'skip'}    | ${false}   | ${1}
 ${4}  | ${users4} | ${'skip'}    | ${false}   | ${2}
 ${1}  | ${users4} | ${'reverse'} | ${false}   | ${4}
 ${2}  | ${users4} | ${'reverse'} | ${false}   | ${1}
 ${3}  | ${users4} | ${'reverse'} | ${false}   | ${2}
 ${4}  | ${users4} | ${'reverse'} | ${false}   | ${3}
 ${1}  | ${users2} | ${undefined} | ${true}    | ${2}
 ${1}  | ${users2} | ${'skip'}    | ${true}    | ${1}
 ${1}  | ${users2} | ${'reverse'} | ${true}    | ${2}
 ${2}  | ${users2} | ${undefined} | ${true}    | ${1}
 ${2}  | ${users2} | ${'skip'}    | ${true}    | ${2}
 ${2}  | ${users2} | ${'reverse'} | ${true}    | ${1}
 ${1}  | ${users3} | ${undefined} | ${true}    | ${3}
 ${3}  | ${users3} | ${undefined} | ${true}    | ${2}
 ${1}  | ${users3} | ${'skip'}    | ${true}    | ${2}
 ${2}  | ${users3} | ${'skip'}    | ${true}    | ${3}
 ${1}  | ${users3} | ${'reverse'} | ${true}    | ${2}
 ${2}  | ${users3} | ${'reverse'} | ${true}    | ${3}
 ${1}  | ${users4} | ${undefined} | ${true}    | ${4}
 ${4}  | ${users4} | ${undefined} | ${true}    | ${3}
 ${1}  | ${users4} | ${'skip'}    | ${true}    | ${3}
 ${2}  | ${users4} | ${'skip'}    | ${true}    | ${4}
 ${3}  | ${users4} | ${'skip'}    | ${true}    | ${1}
 ${4}  | ${users4} | ${'skip'}    | ${true}    | ${2}
 ${1}  | ${users4} | ${'reverse'} | ${true}    | ${2}
 ${2}  | ${users4} | ${'reverse'} | ${true}    | ${3}
 ${3}  | ${users4} | ${'reverse'} | ${true}    | ${4}
 ${4}  | ${users4} | ${'reverse'} | ${true}    | ${1}
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
 ${1}  | ${users2} | ${false}   | ${2}
 ${2}  | ${users2} | ${false}   | ${1}
 ${1}  | ${users2} | ${true}    | ${2}
 ${2}  | ${users2} | ${true}    | ${1}
 ${1}  | ${users3} | ${false}   | ${3}
 ${2}  | ${users3} | ${false}   | ${1}
 ${3}  | ${users3} | ${false}   | ${2}
 ${1}  | ${users3} | ${true}    | ${2}
 ${2}  | ${users3} | ${true}    | ${3}
 ${3}  | ${users3} | ${true}    | ${1}
 ${1}  | ${users4} | ${false}   | ${4}
 ${2}  | ${users4} | ${false}   | ${1}
 ${3}  | ${users4} | ${false}   | ${2}
 ${4}  | ${users4} | ${false}   | ${3}
 ${1}  | ${users4} | ${true}    | ${2}
 ${2}  | ${users4} | ${true}    | ${3}
 ${3}  | ${users4} | ${true}    | ${4}
 ${4}  | ${users4} | ${true}    | ${1}
`('$turn should be', ({ turn, users, isReversed, expected }) => {
  test(`returns ${expected}`, () => {
    expect(culcBeforeUserTurn(turn, users, isReversed)).toBe(expected)
  })
})