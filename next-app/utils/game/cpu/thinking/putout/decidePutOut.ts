import { CPULevel } from "../../../../../@types/game"
import { sepalateSuitNum } from "../../../checkHand"
import { DetectionInfo } from "./updatePrediction"

interface Params {
  cpuLevel: CPULevel
  detectionInfo: DetectionInfo
  putableCards: string[]
}

interface DecidePutOutResponse {
  decition: string | null
}

const decidePutOut = ({ cpuLevel, detectionInfo, putableCards }: Params): DecidePutOutResponse => {
  if (!putableCards.length) {
    return { decition: null }
  }

  // リスク計算ロジックを取得
  const logic = decideLogic({ cpuLevel })

  const decide: {
    card: string | null
    score: number | null
  } = { card: null, score: null }

  putableCards.forEach(card => {
    const sep = sepalateSuitNum([card])[0]
    const score = logic(detectionInfo[Number(sep.num)])

    if (decide.score === null || decide.score < score) {
      decide.card = card
      decide.score = score
    }
  })

  return {
    decition: decide.card
  }
}


interface DecideLogic {
  cpuLevel: CPULevel
}

const decideLogic = ({ cpuLevel }: DecideLogic) => {
  switch (cpuLevel) {
    case 'easy'   : return ({ prediction, damageRisk, positiveScore }: DetectionInfo[0]) => prediction * 0 + damageRisk * 0 - positiveScore
    case 'normal' : return ({ prediction, damageRisk, positiveScore }: DetectionInfo[0]) => prediction     + damageRisk     - positiveScore
    case 'hard'   : return ({ prediction, damageRisk, positiveScore }: DetectionInfo[0]) => prediction * 2 + damageRisk     - positiveScore
    default       : throw new Error('decideLogic - cpuLevel not Provided')
  }
}

export { decidePutOut }