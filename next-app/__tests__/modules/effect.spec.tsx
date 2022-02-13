import { shouldBeSolvedEffects, existShouldBeSolvedEffect, resEffectNumber, resEffectName, resNewEffectState } from "../../utils/game/effect";
import { Effect } from "../../@types/game"

const effects_1:Effect[] = ['wildclub']
const effects_2:Effect[] = ['wilddia']
const effects_3:Effect[] = ['wildheart']
const effects_4:Effect[] = ['wildspade']

describe('existShouldBeSolvedEffect TestCases', () => {
  test.each(shouldBeSolvedEffects)(`%s - shouldBeSolvedEffect 正規アクションはtrueを返す`, action => {
    const result = existShouldBeSolvedEffect([action])
    expect(result).toBe(true)
  })
})
describe.each`
 solvableEffects | expected
 ${['draw2']}    | ${2}
 ${['draw4']}    | ${2}
 ${['draw6']}    | ${2}
 ${['draw8']}    | ${2}
 ${['opencard']} | ${13}
 ${''}           | ${null}
`('$solvableEffects should be', ({ solvableEffects, expected }) => {
  test(`returns ${expected}`, () => {
    expect(resEffectNumber(solvableEffects)).toBe(expected)
  })
})
describe.each`
   card   | expected
 ${'z0'}  | ${'wild'}
 ${'s1'}  | ${'skip'}
 ${'s2'}  | ${'draw2'}
 ${'s3'}  | ${''}
 ${'s8'}  | ${'wild'}
 ${'s11'} | ${'reverse'}
 ${'s13'} | ${'opencard'}
`('$card should be', ({ card, expected }) => {
  test(`returns ${expected}`, () => {
    expect(resEffectName(card)).toBe(expected)
  })
})
describe('resNewEffectState TestCases', () => {
  it('継続中の効果がない場合、カード効果が追加された配列が返却される', () => {
    const effects:Effect[] = []
    const effectName:Effect = 'reverse'
    const result = resNewEffectState(effects, effectName)
    const expected:Effect[] = ['reverse']

    expect(expected).toEqual(result)
  })
  it('draw2効果中でさらにdraw2が出た場合、draw4入りの配列が返却される', () => {
    const effects:Effect[] = ['draw2']
    const effectName:Effect = 'draw2'
    const result = resNewEffectState(effects, effectName)
    const expected:Effect[] = ['draw4']

    expect(expected).toEqual(result)
  })
  it('draw4効果中でさらにdraw2が出た場合、draw6入りの配列が返却される', () => {
    const effects:Effect[] = ['draw4']
    const effectName:Effect = 'draw2'
    const result = resNewEffectState(effects, effectName)
    const expected:Effect[] = ['draw6']

    expect(expected).toEqual(result)
  })
  it('draw6効果中でさらにdraw2が出た場合、draw8入りの配列が返却される', () => {
    const effects:Effect[] = ['draw6']
    const effectName:Effect = 'draw2'
    const result = resNewEffectState(effects, effectName)
    const expected:Effect[] = ['draw8']

    expect(expected).toEqual(result)
  })
  it('wild効果中で効果なしカードが出た場合、効果なしの配列が返却される', () => {
    const noEffect = ''
    const result_1 = resNewEffectState(effects_1, noEffect)
    const result_2 = resNewEffectState(effects_2, noEffect)
    const result_3 = resNewEffectState(effects_3, noEffect)
    const result_4 = resNewEffectState(effects_4, noEffect)
    const expected:Effect[] = []

    expect(result_1).toEqual(expected)
    expect(result_2).toEqual(expected)
    expect(result_3).toEqual(expected)
    expect(result_4).toEqual(expected)
  })
  it('wild効果中で別にwildカードが出た場合、新しいwild効果入りの配列が返却される', () => {
    const effectName:Effect = 'wildclub'
    const result_1 = resNewEffectState(effects_1, effectName)
    const result_2 = resNewEffectState(effects_2, effectName)
    const result_3 = resNewEffectState(effects_3, effectName)
    const result_4 = resNewEffectState(effects_4, effectName)
    const expected:Effect[] = ['wildclub']

    expect(result_1).toEqual(expected)
    expect(result_2).toEqual(expected)
    expect(result_3).toEqual(expected)
    expect(result_4).toEqual(expected)
  })
  it('reverse効果中で別にreverseカードが出た場合、効果なしの配列が返却される', () => {
    const effects:Effect[] = ['reverse']
    const effectName:Effect = 'reverse'
    const result = resNewEffectState(effects, effectName)
    const expected:Effect[] = []

    expect(result).toEqual(expected)
  })
  it('opencard効果中で別にopencardカードが出た場合、opencard入りの配列が返却される', () => {
    const effects:Effect[] = ['opencard']
    const effectName:Effect = 'opencard'
    const result = resNewEffectState(effects, effectName)
    const expected:Effect[] = ['opencard']

    expect(result).toEqual(expected)
  })
  it('複数効果(reverse, draw2)が継続中で別にdraw2カードが出た場合、draw4入りの配列が返却される', () => {
    const effects:Effect[] = ['reverse', 'draw2']
    const effectName:Effect = 'draw2'
    const result = resNewEffectState(effects, effectName)
    const expected:Effect[] = ['reverse', 'draw4']

    expect(result).toEqual(expected)
  })
  it('複数効果(reverse, wilddia)が継続中で効果なしカードが出た場合、wilddiaのみ無くなる', () => {
    const effects:Effect[] = ['reverse', 'wilddia']
    const effectName = ''
    const result = resNewEffectState(effects, effectName)
    const expected:Effect[] = ['reverse']

    expect(result).toEqual(expected)
  })
  it('複数効果(reverse, wilddia)が継続中で別のwildカードが出た場合、(reverse, 新wild)になる', () => {
    const effects:Effect[] = ['reverse', 'wilddia']
    const effectName:Effect = 'wildheart'
    const result = resNewEffectState(effects, effectName)
    const expected:Effect[] = ['reverse', 'wildheart']

    expect(result).toEqual(expected)
  })
  it('複数効果(reverse, wilddia)が継続中でreverseカードが出た場合、効果なし配列が返却される', () => {
    const effects:Effect[] = ['reverse', 'wilddia']
    const effectName:Effect = 'reverse'
    const result = resNewEffectState(effects, effectName)
    const expected:Effect[] = []

    expect(result).toEqual(expected)
  })
})
