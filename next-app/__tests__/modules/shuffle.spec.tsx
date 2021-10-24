import { shuffle } from '../../utils/game/shuffle'
import type { Deck } from '../../@types/card'

describe('shuffle TestCases', () => {
  it('カード配列がシャッフルされていること', () => {
    const data: Deck = {
      card: [
        { suit: 'h', num: 1 },
        { suit: 'd', num: 13 },
        { suit: 's', num: 10 },
        { suit: 'h', num: 8 },
        { suit: 's', num: 3 },
        { suit: 'd', num: 2 },
        { suit: 'c', num: 4 },
        { suit: 's', num: 2 },
        { suit: 'd', num: 1 },
        { suit: 'h', num: 5 }
      ]
    }

    const input = data.card
    const result = shuffle(input)

    expect(result).toHaveLength(input.length)
    expect(result).toEqual(expect.arrayContaining(data.card))
  })
})
