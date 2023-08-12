import { CPULevel } from "../../../../@types/game";

type CheckDangerThresholdPhase = 'putOut'

// 危険予測スコアがここで定義する値より下回る場合はカードを出して良いと判断する
type DangerThresholds = {
  [key1 in CheckDangerThresholdPhase]: { // eslint-disable-line no-unused-vars
    [key2 in CPULevel]: number // eslint-disable-line no-unused-vars
  }
}

const dangerThresholds: DangerThresholds = {
  putOut: {
    hard: 1,
    normal: 2,
    easy: 3,
  },
}

const DANGER_THRESHOLD_DEFAULT = 0

export type GetDangerThresholdParams = {
  mode: CPULevel
  phase: CheckDangerThresholdPhase
}

/**
 * 各フェイズでカードを出すかどうか判断する際に危険度スコアを参考にする
 * その際に危険と判断するスコアの閾値を定義している。
 */
const getDangerThreshold = ({ mode, phase }: GetDangerThresholdParams) => {
  let dangerThreshold = DANGER_THRESHOLD_DEFAULT

  if (typeof dangerThresholds[phase][mode] === 'undefined') {
    throw new Error('getDangerThreshold provided invalidValue')
  }
  dangerThreshold = dangerThresholds[phase][mode]
  return dangerThreshold
}

export { getDangerThreshold }