import { isMyTurnFn, isNextUserTurnFn } from '../../utils/game/turnInfo'
import { Player } from '../../@types/game'

const noInfoUser = { id: 0, nickname: '', turn: 0, score: 0 }

describe('turnInfo TestCases', () => {
  it('isMyTurn:自分のターンかどうか', () => {
    const me: Player = {
      id: 1,
      nickname: 'taro',
      turn: 1,
      score: 0
    }
    const turnUser__me: Player = {
      id: 1,
      nickname: 'taro',
      turn: 1,
      score: 0
    }
    const turnUser__other: Player = {
      id: 2,
      nickname: 'jiro',
      turn: 2,
      score: 0
    }

    const result1 = isMyTurnFn(me, turnUser__me)
    const result2 = isMyTurnFn(me, turnUser__other)

    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })
  it('isNextUserTurn:自分の次のユーザーのターンかどうか', () => {
    const users: Player[] = [
      { id: 1, nickname: 'taro', turn: 1, score: 0 },
      { id: 2, nickname: 'jiro', turn: 2, score: 0 },
      { id: 3, nickname: 'saburo', turn: 3, score: 0 },
      { id: 4, nickname: 'siro', turn: 4, score: 0 },
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
