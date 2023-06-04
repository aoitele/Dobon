import { OtherHands } from "../../../../../@types/game"
import { cntCloseCard, sepalateSuitNum } from "../../../checkHand"
import { resReachNumbers } from "../../../dobonJudge"
import { combination, CombinationProps } from "../enzan/combination"
import deepcopy from 'deepcopy';
import { DOBON_CARD_NUMBER_OPENCARD } from "../../../../../constant";

export type CardInfo = {
  [key in number]: { // eslint-disable-line no-unused-vars
    remain: number // 捨て札や公開手札に出ていない残り枚数
    prediction?: number
  }
}

export interface UpdatePredictionArgs {
  otherHands: OtherHands[]
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
const updatePrediction = ({ otherHands, cardInfo }: UpdatePredictionArgs): CardInfo|undefined => {
  const result = deepcopy(cardInfo) // 元データを書き換えないようにレスポンスデータを定義
  const combinationArgs: CombinationProps = { cards:[], maisu:0 }
  let remainingCardCnt = 0 // デッキ&全ユーザーの未公開手札の合計数

  // CardInfoから各関数で利用する引数を準備する前処理
  for (const [key, value] of Object.entries(cardInfo)) {
    result[Number(key)].prediction = 0 // レスポンスの予測値を初期化
    combinationArgs.cards.push({ number: Number(key), remain: value.remain }) // 掛け合わせ生成関数で利用する情報をセット
    if (value.remain > 0) {
      remainingCardCnt += value.remain // 確率計算に利用する残枚数を加算
    }
  }

  // ここからユーザーごとに手札情報を使って予測値を算出していく
  /* eslint-disable no-continue */
  for (let i=0; i<otherHands.length; i+=1) {
    const hands = otherHands[i].hands // 検証する手札
    const cntClose = cntCloseCard(hands)
    if (cntClose === 0) continue  // 手札が全て公開状態であれば検証しない

    // 公開カード情報を定義
    const openCard = hands.filter(hand => hand !== 'z')
    const openCardNums = sepalateSuitNum(openCard).map(card => Number(card.num))

    /**
     * 組み合わせとしてあり得る数字を算出
     * 公開手札の数字も組み合わせ算出に考慮させるため、remainに追加しておく
     */
    combinationArgs.maisu = hands.length
    for (let n=0; n<openCardNums.length; n+=1) {
      combinationArgs.cards[openCardNums[n]].remain += 1
    }
    let combinationPattern = combination(combinationArgs)

    if (!combinationPattern.length) continue;

    // 公開カードがあれば、その数字を含む組み合わせだけ利用するためフィルタリングしておく
    if (hands.length !== cntClose) {
      combinationPattern = combinationPattern.filter(pattern => {
        const buf = deepcopy(pattern) // 検証用のコピー
        for (let j=0; j<openCardNums.length; j+=1) {
          const idx = buf.indexOf(openCardNums[j])
          if (idx === -1) return false
          buf.splice(idx, 1)
        }
        return true
      })
    }

    // 組み合わせパターンごとにマチを計算。確率を算出しpredictionにスコアとして加算する
    for (let k=0; k<combinationPattern.length; k+=1) {
      const pattern = combinationPattern[k] // 検証する手札のパターン
      if (!pattern.length) continue;

      const reachNumArg = pattern.map(number => number === 0 ? 'x0o' : `c${number}o`)
      const { reachNums } = resReachNumbers(reachNumArg) // マチとなる数字
      if (reachNums.length === 0) continue // マチがなければ次のパターン検証へ
      if (reachNums.filter(num => num <= DOBON_CARD_NUMBER_OPENCARD).length === 0) continue // マチが有効な数字でなければ次のパターン検証へ（14以上のみ）

      /**
       * テストパターンが出現する確率を計算
       * 検証している手札が
       *  - 全て非公開カードの場合：組み合わせパターンの各数字の出現率の積
       *  - 公開カードがある場合：非公開カードの出現率の積
       * 上記をスコアとして、reachNumsで決まったマチ数字に加算していく
       */
      const pbVals: number[] = [] // 出現確率値の配列を入れる
      let tmpCardCnt = remainingCardCnt // 計算に使うカード枚数
      const tmpCardInfo = deepcopy(cardInfo) // 計算に使うカード情報のコピー
      
      // 公開手札のカードは出現率計算で考慮させないために除外する
      for (let t=0; t<openCardNums.length; t+=1) {
        const cardNum = openCardNums[t]
        if (pattern.includes(cardNum)) {
          const idx = pattern.indexOf(cardNum)
          pattern.splice(idx, 1)
        }
      }

      // パターン内の数値をループ。出現率をpbValsに格納していく
      for (let l=0; l<pattern.length; l+=1) {
        const cardNum = pattern[l]
        const incidence = tmpCardInfo[cardNum].remain / tmpCardCnt
        pbVals.push(incidence)
        tmpCardInfo[cardNum].remain -= 1 // 残枚数を減らす
        tmpCardCnt -= 1 // 残枚数を減らす
      }

      // パターンとしての出現率をreachNumが含む数字のスコアとして加算する
      const score = pbVals.reduce((acc, cur) => acc * cur, 1) // 乗算に初期値を与えるため
      for (let m=0; m<reachNums.length; m+=1) {
        const target = result[reachNums[m]]
        if (target && typeof target.prediction === 'number') {
          target.prediction += score
        }
      }
    }
  }
  /* eslint-enable no-continue */
  return result
}

export { updatePrediction }