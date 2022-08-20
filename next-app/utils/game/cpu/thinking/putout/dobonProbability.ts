/**
 * 被ドボン確率計算機
 * @return Number -100 ~ 100
 * - 他ユーザーの手札状況
 * - 場に出されていないカード情報
 * 2点から
 */
/*
 * Import { HandCards } from "../../../../../@types/card"
 * import { OtherHands } from "../../../../../@types/game"
 */
import { resReachNumbers } from "../../../dobonJudge"
import { UsefulInfo } from "./culcDobonRisk"
import { DOBONRISK_MEDIAN } from "./main"
// Import { DeckCards } from "./resRemainingCard"

const dobonProbability = (
  /*
   * Card: HandCards,           // 自分が出そうとしているカード
   * otherHands: OtherHands[],  // 他ユーザーの手札状態
   * remainingCard: DeckCards // 現時点で出されているカードの記憶
   */
): number => {
  /**
   * 他ユーザーの手札枚数から計算ロジックを割り当て
   * 1枚:単騎待ち
   * 2枚:合計or差分
   * 3枚以上:合計
   */

  /**
   * 各ユーザーごとに待ちとしてあり得る数字/ありえない数字を割り出す
   */
  return DOBONRISK_MEDIAN
}

interface oneCloseCulcArgs {
  openCard: string[]
  availableNumber: number[]
  usefulInfo: UsefulInfo
}

/**
 * クローズカード1枚時にpredictionを計算させる関数
 * predictionの値を更新したusefulInfoを返却する
 * 
 * ReachNumに数値があればusefulInfoの対象数字にスコアを加算
 * クローズカードは1枚のため単純に検査カード(culcNum)の出現率(incidence)をスコアとする 
 */
const updatePredictionOneClose = ({ openCard, availableNumber, usefulInfo }: oneCloseCulcArgs) => {
  for (let j=0; j<availableNumber.length; j+=1) {
    const culcNum = availableNumber[j]
    // マチを算出(jokerはsuitをx、他は仮でhにしている)
    const addSuitArg = culcNum === 0 ? `x${availableNumber[j]}` : `h${availableNumber[j]}`
    const reachInfo = resReachNumbers([...openCard, addSuitArg])

    for (let k=0; k<reachInfo.reachNums.length; k+=1) { // eslint-disable-line max-depth
      const key = reachInfo.reachNums[k]
      usefulInfo[Number(key)].prediction += usefulInfo[Number(key)].incidence
    }
  }
  return usefulInfo
}

export { dobonProbability, updatePredictionOneClose }