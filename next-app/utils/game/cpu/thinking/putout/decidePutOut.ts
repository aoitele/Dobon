import { CPULevel } from "../../../../../@types/game"
import { sepalateSuitNum } from "../../../checkHand"
import { DetectionInfo } from "./updatePrediction"

interface Params {
  cpuLevel: CPULevel
  detectionInfo: DetectionInfo
  putableCards: string[]
}

export interface DecidePutOutResponse {
  decition: {
    card: string
    score: number
  }[]
}

const decidePutOut = ({ cpuLevel, detectionInfo, putableCards }: Params) => {
  const result: DecidePutOutResponse = { decition: [] }

  if (!putableCards.length) return result

  // リスク計算ロジックを取得
  const logic = decideLogic({ cpuLevel })

  putableCards.forEach(card => {
    const sep = sepalateSuitNum([card])[0]
    const score = logic(detectionInfo[Number(sep.num)])
    result.decition.push({ card, score })
  })

  // 出すカードを優先度順にソートして返却（スコアが低いカード順）
  result.decition.sort((a, b) => Number(a.score) - Number(b.score))

  return result
}


interface DecideLogic {
  cpuLevel: CPULevel
}

const decideLogic = ({ cpuLevel }: DecideLogic) => {
  switch (cpuLevel) {
    case 'easy'   : return ({ prediction, damageRisk, positiveScore }: DetectionInfo[0]) => prediction * 0 + damageRisk * 0 - positiveScore // リスクは考えず、ポジティブにリーチを目指す
    case 'normal' : return ({ prediction, damageRisk, positiveScore }: DetectionInfo[0]) => prediction     + damageRisk * 0 - positiveScore // ドボンリスクは考慮して、ダメージについては考えない
    case 'hard'   : return ({ prediction, damageRisk, positiveScore }: DetectionInfo[0]) => prediction     + damageRisk     - positiveScore // 全ゲーム終了時の勝利を目指す
    default       : throw new Error('decideLogic - cpuLevel not Provided')
  }
}

export { decidePutOut }