import { modalEffect, isModalEffect, resEffectName } from "../../utils/game/effect";
import { ModalEffect } from "../../@types/game"

describe('isModalEffect TestCases', () => {
  test.each(modalEffect)(`%s - 正規アクションはtrueを返す`, action => {
    expect(isModalEffect(action)).toBe(true)
  })
  it('nullが渡された場合はfalse', () => {
    const action:ModalEffect['action'] = null
    const result = isModalEffect(action)
    expect(result).toBe(false)
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
