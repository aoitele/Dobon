import { HandCards } from "../../@types/card"
import { DOBON_CARD_NUMBER_DRAW_2, DOBON_CARD_NUMBER_JOKER, DOBON_JUDGE_NUMBER_JOKER, DOBON_CARD_NUMBER_OPENCARD } from "../../constant"
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
  const judgeNumber = isPutOutJoker ? DOBON_JUDGE_NUMBER_JOKER : extractCardNum(putOutCard) // Jokerが出された場合は21で判定
  if (judgeNumber === null) return false

  const cardCnt = hands.length               // 手札の枚数
  const existJokerInHand = existJoker(hands) // 手札にJokerがあるか
  const cntJokerInHand = countJoker(hands)   // 手札にあるJokerの枚数

  const judgeMethod = cardCnt === 1 ? 'single' : cardCnt === 2 ? 'sumAndDiff' : 'sum';
  const handNums = resNumArrayExcludeJoker(hands)

  switch (judgeMethod) {
    case 'single':
      if (existJokerInHand) {
        return judgeNumber === DOBON_JUDGE_NUMBER_JOKER
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

/**
 * 手札から待ち数字を算出する関数
 */
const resReachNumbers = (hands: HandCards[] | string[]) => {
  const handsLen = hands.length
  const hasJokerCount = countJoker(hands)

  // 手札がジョーカーのみの場合、確定させて返却
  if (handsLen === hasJokerCount) {
    return {
      handsLen,
      reachNums: hasJokerCount === 1 ? [DOBON_CARD_NUMBER_JOKER] : [DOBON_CARD_NUMBER_DRAW_2]
    }
  }

  const nums = resNumArrayExcludeJoker(hands) // Jokerを除いた手札
  let reachNums: number[] = []

  switch(handsLen) {
    case 1: {
      reachNums = nums
      break
    }
    case 2: {
      const sumNum = sum(nums) + hasJokerCount
      const sumIsBelow13 = sumNum <= DOBON_CARD_NUMBER_OPENCARD // 手札合計が13以下か
      const sumIsNumberJoker = sumNum === DOBON_JUDGE_NUMBER_JOKER // 手札合計が21か

      const diffArg1 = nums[0]
      const diffArg2 = hasJokerCount === 0 ? nums[1] : 1
      const diffNum = diff(diffArg1, diffArg2)
      const diffIsNot0 = diffNum !== 0 // 同じカードを2枚持っていないか
      if (sumIsBelow13) reachNums.push(sumNum)
      if (sumIsNumberJoker) reachNums.push(DOBON_CARD_NUMBER_JOKER)
      if (diffIsNot0) reachNums.push(diffNum)
      break
    }
    // 手札が3枚以上の場合
    default: {
      // 合計の検証
      const baseSumNum = sum(nums)
      const addJokerSum = baseSumNum + hasJokerCount
      const sumIsBelow13 = addJokerSum <= DOBON_CARD_NUMBER_OPENCARD // 手札合計が13以下か
      const sumIsNumberJoker = addJokerSum === DOBON_JUDGE_NUMBER_JOKER // 手札合計が21か

      if (sumIsBelow13) reachNums.push(addJokerSum)
      if (sumIsNumberJoker) reachNums.push(DOBON_CARD_NUMBER_JOKER)

      /**
       * ジョーカーを持つ場合は差分を検証
       * 1枚の場合:ジョーカー以外のカード合計値 - 1
       * 2枚の場合:ジョーカー以外のカード合計値 -2, +-0の値
       * を上がり数値に加える
       */

      if (hasJokerCount > 0) {
        const diffNum = diff(baseSumNum, hasJokerCount)
        const diffIsNot0 = diffNum !== 0
        if (diffIsNot0) {
          // Diff関数は-1も1として返すため、もしbaseSumNumと重複していた場合は片方のみ採用している
          (hasJokerCount === 1 || baseSumNum === diffNum)
          ? reachNums.push(diffNum)
          : reachNums.push(baseSumNum, diffNum)
        }
      }
    }
  }

  return {
    handsLen,
    reachNums: reachNums.sort((a, b) => a - b)
  }
}

export { sum, diff, dobonJudge, resNumArrayExcludeJoker, resReachNumbers }
