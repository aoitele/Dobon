import spreadCardState from '../../utils/game/spreadCardState'
import { AllowCardStringType, HandCards } from '../../@types/card'

describe('spreadCardState TestCases', () => {
  it('全てクローズカード(自分の手札ではない)場合', () => {
    const input:HandCards[] = ['c1', 'd10']
    const expected:AllowCardStringType[] = [
      { suit:'z', num: null, isOpen:false, isPutable: false },
      { suit:'z', num: null, isOpen:false, isPutable: false }
    ]
    const result = spreadCardState(input)
    expect(result).toEqual(expected)
  })
  it('一部オープンカード(自分の手札ではない)場合', () => {
    const input:HandCards[] = ['c1', 'd10o', 's8']
    const expected:AllowCardStringType[] = [
      { suit:'z', num: null, isOpen:false, isPutable: false },
      { suit:'d', num: 10, isOpen:true, isPutable: false },
      { suit:'z', num: null, isOpen:false, isPutable: false }
    ]
    const result = spreadCardState(input)
    expect(result).toEqual(expected)
  })
  it('全てオープンカード(自分の手札ではない)場合', () => {
    const input:HandCards[] = ['c1o', 'd10o', 's8o']
    const expected:AllowCardStringType[] = [
      { suit:'c', num: 1, isOpen:true, isPutable: false },
      { suit:'d', num: 10, isOpen:true, isPutable: false },
      { suit:'s', num: 8, isOpen:true, isPutable: false }
    ]
    const result = spreadCardState(input)
    expect(result).toEqual(expected)
  })
  it('joker(x0, x1o)を含む(自分の手札ではない)場合', () => {
    const input:HandCards[] = ['c1o','x0', 'x1o']
    const expected:AllowCardStringType[] = [
      { suit:'c', num: 1, isOpen:true, isPutable: false },
      { suit:'z', num: null, isOpen:false, isPutable: false },
      { suit:'x', num: 1, isOpen:true, isPutable: false }
    ]
    const result = spreadCardState(input)
    expect(result).toEqual(expected)
  })
})