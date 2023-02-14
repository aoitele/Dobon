import { Redis } from "ioredis"
import { shuffle } from "../../shuffle"

const getBonus = async (adapterPubClient: Redis, deckKey: string, trashKey: string) => {
  // const deckKey = `room:${roomId}:deck`
  let deckCards = await adapterPubClient.smembers(deckKey) // Deckのカードを全て取得

  // deckがない場合、trashから再生成させる
  if (!deckCards.length) {
    deckCards = await adapterPubClient.lrange(trashKey, 1, -1) // eslint-disable-line no-await-in-loop
  }

  deckCards = shuffle(deckCards) // 固定化させないため改めてシャッフル
  /**
   * 上がり計算に利用するbonusCardの確定処理
   * deckから2枚カードを引く
   * 2枚目移行、11以上のカードとjokerが出ればカードを引き続ける事ができる
   */
  // 1枚目のボーナスは確定させておく
  const bonusCards:string[] = [`${deckCards[0]}o`]

  const isApper10Card = (card: string) => {
    const cardNum = card.match(/\d+/u)
    if (cardNum === null) return false
    if (Number(cardNum) < 11 && ['x0', 'x1'].includes(card) === false) return false
    return true
  }

  // 2枚目移行のボーナスを確定させていく、連続ドロー条件を適用。
  for (let i=1; i<deckCards.length; i+=1) {
    let bonusCard = deckCards[i]
    const isDrawable = typeof bonusCard !== 'undefined'

    // Deckからドローできる限りはdeckからカードを取得(10以下のカードを引いた場合は終了)
    if (isDrawable) {
      bonusCards.push(`${bonusCard}o`)
      if (isApper10Card(bonusCard) === false) break
    }
    // もしdeckが切れた場合、trashの最新1枚以外で新デッキを生成してドローしていく
    if (!isDrawable) {
      // const trashKey = `room:${roomId}:trash`
      let trashCard = await adapterPubClient.lrange(trashKey, 1, -1) // eslint-disable-line no-await-in-loop
      trashCard = shuffle(deckCards) // 固定化させないため改めてシャッフル

      for (let j=0; j<trashCard.length; j+=1) {
        bonusCard = trashCard[j]
        bonusCards.push(`${bonusCard}o`)
        if (isApper10Card(bonusCard) === false) break // eslint-disable-line max-depth
      }
    }
  }

  return bonusCards
}

export { getBonus }