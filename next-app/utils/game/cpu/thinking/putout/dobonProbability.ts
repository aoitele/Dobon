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

export { dobonProbability }