import { combination, CombinationProps } from '../../utils/game/cpu/thinking/enzan/combination'
import { TWO_CARD_NUMBER_COMBINATION, THREE_CARD_NUMBER_COMBINATION } from '../__mocks__/data/combination'

const FULL_CARD_COMBINATION_ARG_TWO :CombinationProps = {
  cards: [
    { number:0, remain:2 },
    { number:1, remain:4 },
    { number:2, remain:4 },
    { number:3, remain:4 },
    { number:4, remain:4 },
    { number:5, remain:4 },
    { number:6, remain:4 },
    { number:7, remain:4 },
    { number:8, remain:4 },
    { number:9, remain:4 },
    { number:10, remain:4 },
    { number:11, remain:4 },
    { number:12, remain:4 },
    { number:13, remain:4 },
  ],
  maisu:2
}

const FULL_CARD_COMBINATION_ARG_THREE :CombinationProps = {
  ...FULL_CARD_COMBINATION_ARG_TWO,
  maisu: 3
}


describe('combination TestCases', () => {
  it('数字(0〜13)から2枚選択 - 196通りの組み合わせを得る', () => {
    const result = combination(FULL_CARD_COMBINATION_ARG_TWO)
    expect(result).toEqual(TWO_CARD_NUMBER_COMBINATION)
    expect(result).toHaveLength(196)
  })
  it('数字(0〜13)から3枚選択 - 2743通りの組み合わせを得る', () => {
    const result = combination(FULL_CARD_COMBINATION_ARG_THREE)
    expect(result).toEqual(THREE_CARD_NUMBER_COMBINATION)
    expect(result).toHaveLength(2743)
  })
  it('数字(1〜13)から2枚選択 - 0はどの組み合わせにも存在しない', () => {
    const excludeNumber = 0
    const expectedArray = TWO_CARD_NUMBER_COMBINATION.filter(array => !array.includes(excludeNumber))
    const combinationArgs :CombinationProps = {
      cards: FULL_CARD_COMBINATION_ARG_TWO['cards'].map(item => item.number === excludeNumber ? { ...item, remain: 0 } : item),
      maisu: 2
    }
    const result = combination(combinationArgs)
    expect(result).toEqual(expectedArray)
    expect(result).toHaveLength(169)
  })
  it('数字(1〜13)から3枚選択 - 0, 1はどの組み合わせにも存在しない', () => {
    const excludeNumber = [0, 1]
    const expectedArray = THREE_CARD_NUMBER_COMBINATION.filter(array => !array.includes(excludeNumber[0]) && !array.includes(excludeNumber[1]))
    const combinationArgs :CombinationProps = {
      cards: FULL_CARD_COMBINATION_ARG_THREE['cards'].map(item => excludeNumber.includes(item.number) ? { ...item, remain: 0 } : item),
      maisu: 3
    }
    const result = combination(combinationArgs)
    expect(result).toEqual(expectedArray)
    expect(result).toHaveLength(1728)
  })
})
  