import { HandCards } from "../../../../../@types/card"
import { CPULevel, OtherHands } from "../../../../../@types/game"
import { DOBON_CARD_NUMBER_JOKER, DOBON_JUDGE_NUMBER_JOKER, DOBON_NUMBER_OF_FACE_CARD } from "../../../../../constant"
import { countFaceCards } from "../../../checkCard"
import { resRemainingCard } from "./resRemainingCard"
import { resRiskCard } from "./resRiskCard"
import { DetectionInfo, updatePrediction } from "./updatePrediction"

export const DOBONRISK_MAX = 101
export const DOBONRISK_MEDIAN = 0
export const DOBONRISK_MIN = -101

/**
 * https://github.com/aoitele/Dobon/issues/35
 * 自分が出せるカードごとに、他ユーザーと場の状況から被ドボンリスクを算出する
 * 他ユーザーの待ちが存在するか
 *  - 手札1〜2枚のユーザー数(確実に待っている人)
 *  - 3枚以上のユーザーでも公開カード合計値が低い人ならリスクと考える
 *  - 捨て札で4枚出た数字があれば、その数字は除外して考えられる
 */
interface CulcDobonRiskProps {
  ownHands: OtherHands
  otherHands: OtherHands[]
  trashedMemory: string[]
  cpuLevel?: CPULevel
  deckCount: number
}

export type DobonRiskReturnValue = { card:HandCards, dobonRisk: number }[]

const main = ({ownHands, otherHands, trashedMemory, cpuLevel, deckCount}: CulcDobonRiskProps): DetectionInfo => { // eslint-disable-line no-unused-vars
  /*
   * 手札全公開のユーザーが存在する場合、リスクナンバーを取得
   */
  const defineRiskCards = resRiskCard(otherHands) // eslint-disable-line no-unused-vars

  /*
   * 場に出されたカードと他ユーザーの公開手札から 数字毎にデッキor手札に残っている枚数を計算
   */
  const detectionInfo = resRemainingCard(otherHands, trashedMemory)

  /*
   * カード数字ごとに被ドボン率を算出
   */
  const prediction = updatePrediction({ otherHands, detectionInfo }) // eslint-disable-line no-unused-vars

  /*
   * Const dobonProbability = 0           // ドボンされる可能性
   * const damageRisk = 0                 // ダメージリスク
   * const positiveProbability = 0        // ポジティブ値(自分が出すことによって今後有利になる度合い)
   */
  if (defineRiskCards.length) {
    for (const card of defineRiskCards) {
      prediction[card].prediction = 100 // 最大リスク値をセット
    }
  }
  /**
   * ダメージリスク
   * 山札の残存絵札数から算出
   */
  // 自手札、他ユーザー公開手札、トラッシュの絵札枚数をカウント
  const faceCountMe = countFaceCards({ cards: ownHands.hands, openOnly: false })
  // 他ユーザー公開手札の絵札枚数をカウント
  const otherHandsCards = otherHands.map(item => item.hands).flat()
  const faceCountOthers = countFaceCards({ cards: otherHandsCards, openOnly: true })
  const faceCountTrash = countFaceCards({ cards: trashedMemory, openOnly: false })
  // 残絵札枚数(他人の未公開手札か山札にあるもの)は0〜14の範囲となる
  const remainingFaceCardsCount = DOBON_NUMBER_OF_FACE_CARD - (faceCountMe + faceCountOthers + faceCountTrash) // eslint-disable-line no-unused-vars
  // 山札に絵札がある確率を算出
  const damageRisk = remainingFaceCardsCount / deckCount

  for (const [k, ] of Object.entries(prediction)) {
    const keyNum = Number(k)
    const damageBaseNum = (keyNum === DOBON_CARD_NUMBER_JOKER) ? DOBON_JUDGE_NUMBER_JOKER : keyNum
    // ダメージリスクは「ドボンされた値の大きさ + 絵札の出現率」
    prediction[keyNum].damageRisk = (damageBaseNum / 10) + damageRisk
  }

  return prediction
  /*
   * CPU難易度によってリスク計算ロジックを変える
   * switch (cpuLevel) {
   *   case 'easy'  : return dobonProbability * 0 + damageRisk * 0 - positiveProbability
   *   case 'normal': return dobonProbability + damageRisk * 0 - positiveProbability
   *   case 'hard'  : return dobonProbability * 2 + damageRisk - positiveProbability
   *   default      : return DOBONRISK_MEDIAN
   * }
   */
}

export default main