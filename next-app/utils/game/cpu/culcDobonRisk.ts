import { HandCards } from "../../../@types/card"
import { CPULevel, OtherHands } from "../../../@types/game"
import { resReachNumbers } from "../dobonJudge"
import { canIReverseDobon } from "../reverseDobon"
import spreadCardState from "../spreadCardState"

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

const culcDobonRisk = ({ownHands, otherHands}: CulcDobonRiskProps): DobonRiskReturnValue => {
  
  /**
   * 他ユーザーの手札状況からリスク数字を算出する
   */
  const defineRiskCards:number[] = []  // 全て公開カードなどで待ち数字と分かっている数字
  const spreadCard = otherHands.map(item => spreadCardState(item.hands))
  // 全公開ユーザーがいれば確定リスクカードに追加
  for (let i=0; i<spreadCard.length; i+=1) {
    const openCardCnt = spreadCard[i].filter(item => item.isOpen).length // 公開中のカード枚数
    const handsLen = spreadCard[i].length // 検査対象ユーザーの手札数
    if (openCardCnt !== handsLen) break // 全公開でなければ検査終了
    
    // 手札枚数により待ち数字を計算する
    const otherHandsInfo = resReachNumbers(otherHands[i].hands)
    if (otherHandsInfo.reachNums.length) {
      defineRiskCards.push(...otherHandsInfo.reachNums)
    }
  }
  const risk = culcRiskWithMyHand(ownHands, defineRiskCards)
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

/**
 * 被ドボンリスクの計算処理
 * ownHandsの全カードをチェックした結果を返す
 */
const culcRiskWithMyHand = (ownHands: HandCards[], defineRiskCards: number[]): DobonRiskReturnValue => {
  const res:DobonRiskReturnValue = []
  const check = (card: HandCards) => {
    const putOutNum: number = spreadCardState([card])[0].num

    // ドボン返しを作れる場合、最良リスクで返却する
    if (canIReverseDobon(card, ownHands)) {
      return { card, dobonRisk: DOBONRISK_MIN }
    }
    // 確定リスクカードに含まれる数字の場合、最大リスクを結果として返す
    if (defineRiskCards.includes(putOutNum)) 
    return { card, dobonRisk: DOBONRISK_MAX }

    // どちらでもない場合、ドボンリスク算出に入る
    return { card, dobonRisk: DOBONRISK_MEDIAN }
  }

  for (let i=0; i<ownHands.length; i+=1) {
    const risk = check(ownHands[i])
    if (risk) {
      res.push(risk)
    }
  }
  return res
}

export { culcDobonRisk }