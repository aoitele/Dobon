import { HandCards } from "../../@types/card"
import { DOBON_CARD_NUMBER_JOKER } from "../../constant"
import { countJoker, existJoker, extractCardNum, isJoker } from "./checkCard"

/**
 **
 * 出されたカード(putOutCard) / 手札(hand)
 * 手札が1枚の場合： 出されたカードと手札の数字が合致すればドボン(単騎待ち)
 * 手札が2枚の場合： 出されたカードが手札2枚の合計値/もしくは差分と合致すればドボン
 * 手札が3枚以上の場合： 出されたカードが手札の合計値と合致すればドボン
 *
 * 出されたカードがJoker(0)1枚の場合、計算値が21であればドボン
 * 手札にJoker(x0もしくはx1)が含まれる場合、手札数にかかわらず+1/-1どちらでも使える
 */
const dobonJudge = (putOutCard: HandCards | string, hands: HandCards[] | string[]): boolean => {
  const isPutOutJoker = isJoker(putOutCard)  // Jokerが出されたか
  const judgeNumber = isPutOutJoker ? DOBON_CARD_NUMBER_JOKER : extractCardNum(putOutCard) // Jokerが出された場合は21で判定
  if (judgeNumber === null) return false

  const cardCnt = hands.length               // 手札の枚数
  const existJokerInHand = existJoker(hands) // 手札にJokerがあるか
  const cntJokerInHand = countJoker(hands)   // 手札にあるJokerの枚数

  const judgeMethod = cardCnt === 1 ? 'single' : cardCnt === 2 ? 'sumAndDiff' : 'sum';
  const handNums = resNumArrayExcludeJoker(hands)

  switch (judgeMethod) {
    case 'single':
      if (existJokerInHand) {
        return judgeNumber === DOBON_CARD_NUMBER_JOKER
      }
      return handNums[0] === judgeNumber

    case 'sumAndDiff':
      if (existJokerInHand) {
        return judgeWithJokerSumAndDiff(judgeNumber, handNums, cntJokerInHand)
      }
      return sum(handNums) === judgeNumber
        ? true
        : diff(handNums[0], handNums[1]) === judgeNumber

    case 'sum':
      if (existJokerInHand) {
        return judgeWithJokerSumAndDiff(judgeNumber, handNums, cntJokerInHand)
      }
      return sum(handNums) === judgeNumber
    default:
      return false
  }
}

const sum = (data: number[]) => data.reduce((acc, cur) => acc + cur)
const diff = (arg1: number, arg2: number) => Math.abs(arg1 - arg2)
const judgeWithJokerSumAndDiff = (
  judgeNumber: number,
  hand: number[],
  cntJokerInHand: number
): boolean => {
  if (cntJokerInHand === 1) {
    return Math.abs(sum(hand) - judgeNumber) === 1
  }
  const matcher = [-2, 0, 2]
  return matcher.includes(sum(hand) - judgeNumber)
}

/**
 * Jokerを除いた手札のnumArrayを生成する関数
 * mapの都合上、jokerとregexMatch(null)は0で処理して除外している
 */
const resNumArrayExcludeJoker = (hands: HandCards[] | string[]) => {
  return hands.map(hand => {
    if (isJoker(hand)) return 0
    const num = extractCardNum(hand)
    return Number(num) // If NULL ToBe 0
  }).filter(num => num !== 0)
}

export { sum, diff, dobonJudge, resNumArrayExcludeJoker }
