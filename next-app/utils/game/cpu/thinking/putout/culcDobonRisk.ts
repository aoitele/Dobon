import { HandCards } from "../../../../../@types/card"
import { OtherHands } from "../../../../../@types/game"
// Import { countJoker } from "../../../checkCard"
import { cntCloseCard } from "../../../checkHand"
import { canIReverseDobon } from "../../../reverseDobon"
import spreadCardState from "../../../spreadCardState"
import { dobonProbability, updatePredictionOneClose } from "./dobonProbability"
import { DobonRiskReturnValue, DOBONRISK_MIN, DOBONRISK_MAX } from "./main"
import { DeckCards } from "./resRemainingCard"

/**
 * 被ドボンリスクの計算処理
 * ownHandsの全カードをチェックした結果を返す
 */
 interface CulcRiskProps {
  ownHands: HandCards[]
  otherHands: OtherHands[]
  defineRiskCards: number[]
  remainingCard: DeckCards
}

export type CardInfo = {
  [key in string]: { // eslint-disable-line no-unused-vars
    remain: number // 捨て札や公開手札に出ていない残り枚数
    incidence: number // 1枚引く時の出現率(1なら100%と考える)
    prediction: number // 他ユーザーのマチである確率(1なら100%と考える)
  }
}

/**
 * 自分の手札にあるカードごとにドボンが発生する確率を算出する関数
 * 他ユーザー手札より確定しているリスクカード(defineRiskCards)は最大リスク
 * 自分がドボン返しを作れる場合は最小リスク
 * として被ドボンリスクを返す
 */
const culcDobonRisk = ({ownHands, otherHands, defineRiskCards, remainingCard}: CulcRiskProps): DobonRiskReturnValue => {
  const res:DobonRiskReturnValue = []
  const availableNumber: number[] = [] // 待ち数字を算出する組み合わせとして使える数値
  let cardInfo: CardInfo = {}
  let isJokerAvailable = false // 待ち計算にjokerが利用可能かのフラグ
  let remainingCardCnt = 0 // デッキ&全ユーザーの未公開手札の合計数
  
  // 未公開手札の合計数を算出
  for (const [, value] of Object.entries(remainingCard)) {
    remainingCardCnt += value
  }
  // 数字ごとに出現率(incidence)を算出、出現率0でないカードはマチ計算利用カードに追加
  for (const [key, value] of Object.entries(remainingCard)) {
    cardInfo[Number(key)] = { remain: value, incidence: value / remainingCardCnt, prediction: 0 }
    if (value > 0) {
      availableNumber.push(Number(key))
    }
  }
  // マチ利用カードにjokerがある場合はフラグを書き換え
  if (availableNumber.find(num => num === 0)) {
    isJokerAvailable = true // eslint-disable-line no-unused-vars
  }

  /**
   * 手札全公開でないユーザーのマチ確率を出す
   * 
   * 調査対象となるケース
   * 1. 手札枚数が1枚/2枚/3枚のいずれか
   * 2. 手札4枚でも公開手札が2枚以上ある時(かつ公開手札の合計値が10以下であれば)
   *
   * 方法
   * openCardの計算値にクローズカード(z)の組み合わせでマチ数字が1〜13に収まればpredictionにスコア加算
   * 加算されるスコアは出現率(incidence)と掛け合わせた値
   *
   * 計算機
   * 手札枚数で決まる計算ロジックを用いて、zの枚数分だけ全通りのマチ数字を計算
   * 1〜13に収まればpredictionにスコア加算してcardInfoを返す関数
   */

  for (let i=0; i<otherHands.length; i+=1) {
    const target = otherHands[i] // 調査対象ユーザー
    const hands = target.hands
    const handsLen = hands.length
    const cntClose = cntCloseCard(hands)
    const cntOpen = handsLen - cntClose
    // Const cntJoker = countJoker(hands)
    const openCard = hands.filter(card => card !== 'z')

    /* eslint-disable */
    if (cntClose === 0) continue // 手札全公開ユーザーのマチはdefineRiskCardsで分かっているため考慮しない
    if (handsLen >= 5) continue // 手札が5枚以上のユーザーは考慮しない
    if (handsLen === 4 && cntOpen < 2) continue // 手札が4枚で公開手札が2枚未満のユーザーは考慮しない
    /* eslint-enable */
    // Console.log(`手札${handsLen}:非公開${cntClose}`)
    
    switch (handsLen) {
      case 1: {
        // 手札1枚の時は必ずClose状態である。カード出現率と同じ確率となるので、均等に全数字をスコアリング
        for (const [k,] of Object.entries(cardInfo)) {
          cardInfo[Number(k)].prediction += cardInfo[Number(k)].incidence
        }
        break
      }
      case 2: {
        /**
         * 手札2枚の時はClose/Close、Close/Openの可能性がある。
         * マチとなる数を算出し、出現率と掛け合わせた値をスコアリングさせる。
         * 
         * 引くカードの組み合わせごとに下記を計算する
         * 数字ごとのprediction += 2枚の計算でマチとなる数値 * その組み合わせが出る確率
         * 
         * 全組み合わせ数
         * { number: 0, remain: 2, incidence: 0.04, prediction: 0 },
         * { number: 1, remain: 4, incidence: 0.08, prediction: 0 },
         * { number: 2, remain: 4, incidence: 0.08, prediction: 0 },
         * 
         * → jokerと1を引く確率は？
         *  0.04 * 0.08 = 0.0032(0.32%)
         * 
         * → 1と2を引く確率は？
         *  0.08 * 0.08 = 0.0064(0.64%)
         * 
         * カードを引いたときに「その数字がまだ残っているか」によって次の確率計算が変わる 
         */
        switch (cntClose) {
          case 1: {
            // 1枚のみCloseの場合、open状態の1枚とavailableNumberの組み合わせでマチを算出
            cardInfo = updatePredictionOneClose({ openCard, availableNumber, cardInfo })
            break;
          }
          case 2: {
            // 2枚ともCloseの場合、availableNumberの組み合わせでマチを算出
            break;
          }
          default: break;
        }
        break
      }
      case 3: {
        // 手札3枚の場合
        switch (cntClose) {
          case 1: {
            // 1枚のみCloseの場合、open状態の2枚とavailableNumberの組み合わせでマチを算出
            cardInfo = updatePredictionOneClose({ openCard, availableNumber, cardInfo })
            break;
          }
          case 2: {
            // 2枚がCloseの場合、open状態の1枚とavailableNumberの組み合わせでマチを算出
            break;
          }
          case 3: {
            // 3枚ともCloseの場合、availableNumberの組み合わせでマチを算出
            break;
          }
          default: break;
        }
        break
      }
      case 4: {
        // 手札4枚の場合
        break
      }
      default: break
    }
    // Console.log(cardInfo, '結果')
  }

  // リスク計算処理
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
    return { card, dobonRisk: dobonProbability() }
  }

  // 全手札のリスクを算出した結果をレスポンスデータに入れて返す
  for (let i=0; i<ownHands.length; i+=1) {
    const risk = check(ownHands[i])
    if (risk) res.push(risk)
  }
  return res
}

export { culcDobonRisk }