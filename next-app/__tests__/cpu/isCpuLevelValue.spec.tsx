import { isCpuLevelValue } from '../../utils/game/cpu/utils/isCPULevelValue'

describe('cpu/utils - isCPULevelValue TestCases', () => {
  it('not CPULevelValue', () => {
    const arg = 'test'
    const result = isCpuLevelValue(arg)
    expect(result).toBe(false)
  })
  it('not CPULevelValue - contain level Value String', () => {
    const arg = 'hard2'
    const result = isCpuLevelValue(arg)
    expect(result).toBe(false)
  })
  it('match CPULevelValue', () => {
    const arg = 'hard'
    const result = isCpuLevelValue(arg)
    expect(result).toBe(true)
  })
})
