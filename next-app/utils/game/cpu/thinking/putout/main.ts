import { HandCards } from "../../../../../@types/card"
import { CPULevel, OtherHands } from "../../../../../@types/game"
import { culcDobonRisk } from "./culcDobonRisk"
import { resRemainingCard } from "./resRemainingCard"
import { resRiskCard } from "./resRiskCard"

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
  ownHands:HandCards[]
  otherHands: OtherHands[]
  cpuLevel: CPULevel
}

export type DobonRiskReturnValue = { card:HandCards, dobonRisk: number }[]

const main = ({ownHands, otherHands}: CulcDobonRiskProps): DobonRiskReturnValue => {
  // 手札全公開のユーザーが存在する場合、リスクナンバーを取得
  const defineRiskCards = resRiskCard(otherHands)

  // これまで場に出されたカード情報を取得
  const trashedMemory:HandCards[] = []

  // 場に出されたカードと他ユーザーの公開手札から 数字毎にデッキor手札に残っている枚数を計算
  const remainingCard = resRemainingCard(otherHands, trashedMemory)

  // カード数字ごとに被ドボン率を算出

  // 自分の手札カード全てについて被ドボンリスクを算出する
  const risk = culcDobonRisk({ownHands, otherHands, defineRiskCards, remainingCard})
  /*
   * Let riskUserCnt = 0                // リスクユーザーの数
   * let riskNumCnt = 0                 // 待ち数字と考えられる枚数
   */
  /*
   * Const dobonProbability = 0           // ドボンされる可能性
   * const damageRisk = 0                 // ダメージリスク
   * const positiveProbability = 0        // ポジティブ値(自分が出すことによって今後有利になる度合い)
   */

  return risk
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