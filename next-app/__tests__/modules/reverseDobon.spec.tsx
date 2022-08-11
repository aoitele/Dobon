import { HandCards } from '../../@types/card'
import { canIReverseDobon } from '../../utils/game/reverseDobon'

describe('canIReverseDobon TestCases', () => {
  it('ドボン返しができない場合(手札1枚)', () => {
    const putOutCard: HandCards = 'c9o'
    const ownHands: HandCards[] = ['c9o']  
    const result = canIReverseDobon(putOutCard, ownHands)
    expect(result).toBe(false)
  })
  it('ドボン返しができない場合(手札2枚)', () => {
    const putOutCard: HandCards = 'c9o'
    const ownHands: HandCards[] = ['c9o', 'c10o']
    const result = canIReverseDobon(putOutCard, ownHands)
    expect(result).toBe(false)
  })
  it('ドボン返しができる場合(手札2枚)', () => {
    const putOutCard: HandCards = 'c9o'
    const ownHands: HandCards[] = ['c9o', 'd9o']
    const result = canIReverseDobon(putOutCard, ownHands)
    expect(result).toBe(true)
  })
  it('ドボン返しができる場合(手札3枚)', () => {
    const putOutCard: HandCards = 'c9o'
    const ownHands: HandCards[] = ['c9o', 'd4o', 'h5o']
    const result = canIReverseDobon(putOutCard, ownHands)
    expect(result).toBe(true)
  })
})
