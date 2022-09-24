import { OtherHands } from "../../../../../@types/game"
import { cntCloseCard, sepalateSuitNum } from "../../../checkHand"
import { resReachNumbers } from "../../../dobonJudge"
import { combination, CombinationProps } from "../enzan/combination"
import { CardInfo } from "./culcDobonRisk"
import deepcopy from 'deepcopy';

export interface UpdatePredictionArgs {
  otherHandsArray: OtherHands[]
  cardInfo: CardInfo
}

/**
 * 被ドボン確率計算機
 * @otherHandsArray 自分以外の全ユーザーの手札情報
 * @cardInfoArray
 *
 * @return cardInfo
 *
 * - ユーザーごとに手札を検証
 * - 非公開状態のカードがあれば、あり得る数字の組み合わせを算出
 * - カード出現率を掛け合わせ、マチとなる数字のスコアに加算していく
 */
const updatePrediction = ({ otherHandsArray, cardInfo }: UpdatePredictionArgs): CardInfo => {
  const availableNumber: number[] = []
  const combinationArgs: CombinationProps = { cards:[], maisu:0 }
  let remainingCardCnt = 0 // デッキ&全ユーザーの未公開手札の合計数

  // CardInfoから各関数で利用する引数を準備する前処理
  for (const [key, value] of Object.entries(cardInfo)) {
    combinationArgs.cards.push({ number: Number(key), remain: value.remain }) // 掛け合わせ生成関数で利用する情報をセット
    if (value.remain > 0) {
      availableNumber.push(Number(key)) // 掛け合わせに利用できる数字をセット
      remainingCardCnt += value.remain // 確率計算に利用する残枚数を加算
    }
  }

  // ユーザーごとに手札情報を使って予測値を算出していく
  /* eslint-disable no-continue */
  for (let i=0; i<otherHandsArray.length; i+=1) {
    const hands = otherHandsArray[i].hands // 検証する手札
    const cntClose = cntCloseCard(hands)
    if (cntClose === 0) continue  // 手札が全て公開状態であれば検証しない

    // 組み合わせとしてあり得る数字を算出する
    combinationArgs.maisu = hands.length
    let combinationPattern = combination(combinationArgs)
    
    // 公開カードがあれば、その数字を含む組み合わせだけ利用するためフィルタリングしておく
    if (hands.length !== cntClose) {
      const openCard = hands.filter(hand => hand !== 'z')
      const openCardNums = sepalateSuitNum(openCard).map(card => Number(card.num))
      const uniqueNums = Array.from(new Set(openCardNums))
      // UniqueNumsの値を全て持つパターンのみ予測に使用するために残す
      combinationPattern = combinationPattern.filter(pattern => {
        for (let j=0; j<uniqueNums.length; j+=1) {
          if (!pattern.includes(uniqueNums[j])) return false
        }
        return true
      })
    }

    // 組み合わせパターンごとにマチを計算。確率を算出しpredictionにスコアとして加算する
    for (let k=0; k<combinationPattern.length; k+=1) {
      const pattern = combinationPattern[k]
      const reachNumArg = pattern.map(number => number === 0 ? 'x0o' : `c${number}o`)
      const { reachNums } = resReachNumbers(reachNumArg)
      if (reachNums.length === 0) continue

      // テストパターンが出現する確率を計算
      const pbVals: number[] = [] // 出現確率値の配列を入れる
      let tmpCardCnt = remainingCardCnt // 計算に使うカード枚数
      const tmpCardInfo = deepcopy(cardInfo) // 計算に使うカード情報のコピー

      // パターン内の数値をループ。出現率をpbValsに格納していく。
      for (let l=0; l<pattern.length; l+=1) {
        const cardNum = pattern[l]
        const incidence = tmpCardInfo[cardNum].remain / tmpCardCnt
        pbVals.push(incidence)
        tmpCardInfo[cardNum].remain -= 1 // 残枚数を減らす
        tmpCardCnt -= 1 // 残枚数を減らす
      }

      // パターンとしての出現率をreachNumが含む数字のスコアとして加算する
      const score = pbVals.reduce((acc, cur) => acc * cur)
      for (let m=0; m<reachNums.length; m+=1) {
        cardInfo[reachNums[m]].prediction += score
      }
    }
  }
  /* eslint-enable no-continue */
  return cardInfo
}

export { updatePrediction }