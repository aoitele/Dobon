import { CPULevel } from "../../../../../@types/game"
import { DOBON_CARD_NUMBER_JOKER } from "../../../../../constant"
import { isJoker } from "../../../checkCard"
import { sepalateSuitNum } from "../../../checkHand"
import { getDangerThreshold, GetDangerThresholdParams } from "../../utils/getDangerThreshold"
import { DetectionInfo } from "./updatePrediction"

export interface AddDecitionScoreParams {
  cpuLevel: CPULevel
  detectionInfo: DetectionInfo
  putableCards: string[]
}

export interface AddDecitionScoreResponse {
  decition: {
    card: string
    score: number
  }[]
}

const addDecitionScore = ({ cpuLevel, detectionInfo, putableCards }: AddDecitionScoreParams) => {
  const result: AddDecitionScoreResponse = { decition: [] }

  if (!putableCards.length) return result

  // リスク計算ロジックを取得
  const logic = decideLogic({ cpuLevel })

  putableCards.forEach(card => {
    const sep = sepalateSuitNum([card])[0]
    const targetKey = isJoker(card) ? DOBON_CARD_NUMBER_JOKER : Number(sep.num)
    const score = logic(detectionInfo[targetKey])
    result.decition.push({ card, score })
  })

  // 出すカードを優先度順にソートして返却（スコアが低いカード順、同じ数字はpositiveSortを優先）
  result.decition.sort((a, b) => {
    // スコア順にしてから
    if (a.score !== b.score) {
      return Number(a.score) - Number(b.score)
    }

    // 同じ数字はpositiveSortを優先させる
    const [{num: n1, suit: s1}, {num: n2, suit: s2}] = sepalateSuitNum([a.card, b.card])
    if (n1 === n2) {
      const positiveSuit = detectionInfo[Number(n1)].positiveSuit
      if (!positiveSuit) return 0
      if (positiveSuit === s1) {
        return -1
      } else if(positiveSuit === s2) {
        return 1
      }
    }
    return 0
  })

  return result
}

interface DecideLogicParams {
  cpuLevel: CPULevel
}

const decideLogic = ({ cpuLevel }: DecideLogicParams) => {
  switch (cpuLevel) {
    case 'easy'   : return ({ prediction, damageRisk, positiveScore }: DetectionInfo[0]) => prediction * 0 + damageRisk * 0 - positiveScore // リスクは考えず、ポジティブにリーチを目指す
    case 'normal' : return ({ prediction, damageRisk, positiveScore }: DetectionInfo[0]) => prediction     + damageRisk * 0 - positiveScore // ドボンリスクは考慮して、ダメージについては考えない
    case 'hard'   : return ({ prediction, damageRisk, positiveScore }: DetectionInfo[0]) => prediction     + damageRisk     - positiveScore // 全ゲーム終了時の勝利を目指す
    default       : throw new Error('decideLogic - cpuLevel not Provided')
  }
}

interface DecidePutOutParams {
  trash: string[]
  decition: AddDecitionScoreResponse['decition']
  mode: CPULevel
  phase: GetDangerThresholdParams['phase']
  sameNumberOnly: boolean // trashと同じ数字のみ評価対象にするか（effect回避判定時はtrueで使用する）
}

// CPU難易度に設定された被ドボンリスクの閾値より低いかどうかをチェックする関数
const decidePutOut = ({ trash, decition, mode, phase, sameNumberOnly }: DecidePutOutParams) => {
  const trashNum = sepalateSuitNum([trash[0]])[0].num
  const dangerThreshold = getDangerThreshold({ mode, phase })

  if (sameNumberOnly) {
    const sameNumberCard = decition.find(item => sepalateSuitNum([item.card])[0].num === trashNum)
    return Boolean(sameNumberCard && sameNumberCard.score < dangerThreshold)
  }

  return Boolean(decition[0] && decition[0].score < dangerThreshold)
}

export { addDecitionScore, decidePutOut }