import { CPULevel } from "../../../../@types/game"

const isCpuLevelValue = (arg: string): arg is CPULevel => {
  const cpuLevelStrings: CPULevel[] = ['easy', 'hard', 'normal']
  return ( arg === cpuLevelStrings[0] ||  arg === cpuLevelStrings[1] || arg === cpuLevelStrings[2])
}

export { isCpuLevelValue }