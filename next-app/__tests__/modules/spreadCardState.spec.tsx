import spreadCardState from '../../utils/game/spreadCardState'
import { AllowCardStringType, HandCards } from '../../@types/card'

describe('spreadCardState TestCases', () => {
  it('全てクローズカードの場合', () => {
    const input:HandCards[] = ['c1', 'd10']
    const expected:AllowCardStringType[] = [
      { suit:'z', num: null, isOpen:false },
      { suit:'z', num: null, isOpen:false }
    ]
    const result = spreadCardState(input)
    expect(result).toEqual(expected)
  })
  it('一部オープンカードの場合', () => {
    const input:HandCards[] = ['c1', 'd10o', 's8']
    const expected:AllowCardStringType[] = [
      { suit:'z', num: null, isOpen:false },
      { suit:'d', num: 10, isOpen:true },
      { suit:'z', num: null, isOpen:false }
    ]
    const result = spreadCardState(input)
    expect(result).toEqual(expected)
  })
  it('全てオープンカードの場合', () => {
    const input:HandCards[] = ['c1o', 'd10o', 's8o']
    const expected:AllowCardStringType[] = [
      { suit:'c', num: 1, isOpen:true },
      { suit:'d', num: 10, isOpen:true },
      { suit:'s', num: 8, isOpen:true }
    ]
    const result = spreadCardState(input)
    expect(result).toEqual(expected)
  })
})