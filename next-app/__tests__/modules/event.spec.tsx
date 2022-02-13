import { modalEvents, isModalEvent } from '../../utils/game/event'
import { ModalEffect } from '../../@types/game'

describe('isModalEvent TestCases', () => {
  test.each(modalEvents)(`%s - modalEvents 正規アクションはtrueを返す`, event => {
    expect(isModalEvent(event)).toBe(true)
  })
  it('nullが渡された場合はfalse', () => {
    const action:ModalEffect['action'] = null
    const result = isModalEvent(action)
    expect(result).toBe(false)
  })
})
