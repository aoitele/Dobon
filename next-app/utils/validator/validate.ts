import { CpuTurnEmitData } from './emitData'
import { Rules } from './rule'

export const isCpuTurnEmitData = (data: any, rule:Rules['cpuTurn']): data is CpuTurnEmitData => {
  if (!rule) return true

  for (const property of rule.required) {
    if (!Object.keys(data.data).includes(property)) return false
  }
  return true
}


