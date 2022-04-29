import { DOBON_CARD_NUMBER_JOKER } from "../../constant"
/**
 * @param dobonNum ドボンしたカードの数字
 * @param bonusCards デッキから引いたボーナスカード
 * @param isReverseDobon ドボン返しかどうか
 *
 * スコア計算は「dobonNum * bonusCardsの合計値」
 * isReverseDobonがtrueであれば、最後に2倍した数がスコアとなる
 * ジョーカーがbonusCardsに存在する場合も1枚につき2倍される
 *
 * dobonNumルール
 *  - ジョーカー(x0,x1)は21として扱う
 * bonusCardsルール
 *  - 10以上のカードは10として扱う
 */
const culcGetScore = (dobonNum:number, bonusCards: number[], isReverseDobon = false) => {
  // ジョーカドボンならドボン数値を21にする
  const isJokerDobon = dobonNum === 0
  const dobonBaseNum = isJokerDobon ? DOBON_CARD_NUMBER_JOKER : dobonNum

  // ボーナスカードにあるjokerの枚数
  const jokerCardCount = bonusCards.filter(card => card === 0).length
  const existJocker = jokerCardCount > 0

  // ボーナススコアを計算
  const bonusCardScore = culcBonus(bonusCards)

  // 最終返却時に積算される値を計算(squareRateは1,2,4,8のいずれかとなる)
  const baseRate = isReverseDobon ? 2 : 1 // どぼん返しなら2倍
  const jokerRate = existJocker ? jokerCardCount * 2 : 1 // Jokerの枚数だけ2倍
  const squareRate = baseRate * jokerRate
  const result = dobonBaseNum * bonusCardScore * squareRate

  return result
}

/**
 * どぼん時に与えられるボーナススコアの計算
 * - 10以のカードは「10」
 */
const culcBonus = (bonusCards: number[]) => {
  // ボーナスカードのスコアを算出
  let bcs = bonusCards

  // ボーナスカードにあるjokerの枚数
  const jokerCardCount = bonusCards.filter(card => card === 0).length
  const existJocker = jokerCardCount > 0

  if (existJocker) {
    // Jokerは除外してから合計を計算させる
    bcs = bcs.filter(_ => _ !== 0)
  }

  const bonusCardScore = bcs.reduce((acc, cur) => {
    // 10以上のカードは10として扱う
    const curNum = cur > 10 ? 10 : cur
    return acc + curNum
  }, 0)

  return bonusCardScore
}

export { culcGetScore, culcBonus }