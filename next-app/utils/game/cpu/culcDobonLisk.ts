import { HandCards } from "../../../@types/card"
import { CPULevel, OtherHands } from "../../../@types/game"
import { resReachNumbers } from "../dobonJudge"
import { canIReverseDobon } from "../reverseDobon"
import spreadCardState from "../spreadCardState"

export const DOBONLISK_MAX = 100
export const DOBONLISK_MEDIAN = 0
export const DOBONLISK_MIN = -100

/**
 * https://github.com/aoitele/Dobon/issues/35
 * 自分が出せるカードごとに、他ユーザーと場の状況から被ドボンリスクを算出する
 * 他ユーザーの待ちが存在するか
 *  - 手札1〜2枚のユーザー数(確実に待っている人)
 *  - 3枚以上のユーザーでも公開カード合計値が低い人ならリスクと考える
 *  - 捨て札で4枚出た数字があれば、その数字は除外して考えられる
 */
interface CulcDobonLiskProps {
  card:HandCards
  ownHands:HandCards[]
  otherHands: OtherHands[]
  cpuLevel: CPULevel
}

const culcDobonLisk = ({card, ownHands, otherHands, cpuLevel}: CulcDobonLiskProps): number => {
  const putOutNum: number = spreadCardState([card])[0].num

  // もしドボン返しを作れる手札構成なら最良リスクで返却する
  if (canIReverseDobon(card, ownHands)) return DOBONLISK_MIN

  /*
   * Let liskUserCnt = 0                // リスクユーザーの数
   * let liskNumCnt = 0                 // 待ち数字と考えられる枚数
   */
  const defineLiskCards:number[] = []  // 全て公開カードなどで待ち数字と分かっている数字
  const dobonProbability = 0           // ドボンされる可能性
  const damageLisk = 0                 // ダメージリスク
  const positiveProbability = 0        // ポジティブ値(自分が出すことによって今後有利になる度合い)

  const spreadCard = otherHands.map(item => spreadCardState(item.hands))
  // 全公開ユーザーがいれば確定リスクカードに追加
  for (let i=0; i<spreadCard.length; i+=1) {
    const openCardCnt = spreadCard[i].filter(item => item.isOpen).length // 公開中のカード枚数
    const handsLen = spreadCard[i].length // 検査対象ユーザーの手札数
    if (openCardCnt !== handsLen) break // 全公開でなければ検査終了
    
    // 手札枚数により待ち数字を計算する
    const otherHandsInfo = resReachNumbers(otherHands[i].hands)
    if (otherHandsInfo.reachNums.length) {
      defineLiskCards.push(...otherHandsInfo.reachNums)
    }
  }

  // もし確定リスクカードに含まれる数字であれば最大リスクを結果として返す
  if (defineLiskCards.includes(putOutNum)) return DOBONLISK_MAX

  // CPU難易度によってリスク計算ロジックを変える
  switch (cpuLevel) {
    case 'easy'  : return dobonProbability * 0 + damageLisk * 0 - positiveProbability
    case 'normal': return dobonProbability + damageLisk * 0 - positiveProbability
    case 'hard'  : return dobonProbability * 2 + damageLisk - positiveProbability
    default      : return DOBONLISK_MEDIAN
  }
}

export { culcDobonLisk }