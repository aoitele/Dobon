import { HandCards } from "../../../@types/card"
import { CPULevel, OtherHands } from "../../../@types/game"
import { DOBON_CARD_NUMBER_OPENCARD } from "../../../constant"
import { countJoker } from "../checkCard"
import { diff, resNumArrayExcludeJoker, sum } from "../dobonJudge"
import spreadCardState from "../spreadCardState"

const DOBONLISK_MAX = 100
const DOBONLISK_MEDIAN = 0
// Const DOBONLISK_MIN = -100

/**
 * https://github.com/aoitele/Dobon/issues/35
 * 自分が出せるカードごとに、他ユーザーと場の状況から被ドボンリスクを算出する
 * 他ユーザーの待ちが存在するか
 *  - 手札1〜2枚のユーザー数(確実に待っている人)
 *  - 3枚以上のユーザーでも公開カード合計値が低い人ならリスクと考える
 *  - 捨て札で4枚出た数字があれば、その数字は除外して考えられる
 */
const culcDobonLisk = (card:HandCards, otherHands: OtherHands[], cpuLevel: CPULevel): number => {
  const putOutNum: number = spreadCardState([card])[0].num
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
    
    const ExcludeJokerNums = resNumArrayExcludeJoker(otherHands[i].hands) // Jokerを除いた手札
    const hasJokerCount = countJoker(otherHands[i].hands)

    // 手札枚数により待ち数字を計算する
    switch(handsLen) {
      case 1: {
        if (hasJokerCount === 0) { defineLiskCards.push(ExcludeJokerNums[0]) }
        break
      }
      case 2: {
        switch(hasJokerCount) {
          case 0: {
            const sumNum = sum([...ExcludeJokerNums])
            const diffNum = diff(ExcludeJokerNums[0], ExcludeJokerNums[1])
            const sumIsBelow13 = sumNum <= DOBON_CARD_NUMBER_OPENCARD // 手札合計が13以下か
            const diffIsNot0 = diffNum !== 0 // 手札差分が0でないか
            if (sumIsBelow13) { defineLiskCards.push(sumNum) } 
            if (diffIsNot0) { defineLiskCards.push(diffNum) }
            break
          }
          case 1: {
            const sumNum = ExcludeJokerNums[0] + 1
            const diffNum = diff(ExcludeJokerNums[0], 1)
            const sumIsBelow13 = sumNum <= DOBON_CARD_NUMBER_OPENCARD // 手札合計が13以下か
            const diffIsNot0 = diffNum !== 0 // 手札差分が0でないか
            if (sumIsBelow13) { defineLiskCards.push(sumNum) }
            if (diffIsNot0) { defineLiskCards.push(diffNum) }
            break
          }
          case 2: {
            defineLiskCards.push(2) // ジョーカー2枚の合計となる「2」を追加
            break
          }
          default: break
        }
        break;
      }
      default: { // 手札が3枚以上
        const sumNum = sum([...ExcludeJokerNums]) + hasJokerCount
        const sumIsBelow13 = sumNum <= DOBON_CARD_NUMBER_OPENCARD // 手札合計が13以下か
        if (sumIsBelow13) { defineLiskCards.push(sumNum) }          
      }
    }
  }

  // もし確定リスクカードに含まれる数字であれば最大リスクを結果として返す
  if (defineLiskCards.includes(putOutNum)) {
    return DOBONLISK_MAX
  }

  // CPU難易度によってリスク計算ロジックを変える
  switch (cpuLevel) {
    case 'easy'  : return dobonProbability * 0 + damageLisk * 0 - positiveProbability
    case 'normal': return dobonProbability + damageLisk * 0 - positiveProbability
    case 'hard'  : return dobonProbability * 2 + damageLisk - positiveProbability
    default      : return DOBONLISK_MEDIAN
  }
}

export { culcDobonLisk }