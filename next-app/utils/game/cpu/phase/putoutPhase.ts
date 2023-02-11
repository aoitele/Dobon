import { HandCards } from "../../../../@types/card"
import { Player } from "../../../../@types/game"
import { NestedPartial } from "../../../../@types/utility"
import { CpuTurnEmitData } from "../../../../@types/emitData"
import { cardsICanPutOut, sepalateSuitNum } from "../../checkHand"
import { reducerPayloadSpecify } from "../../roomStateReducer"
import sleep from "../../sleep"
import { culcNextUserTurn } from "../../turnInfo"
import { CpuMainProcessArgs } from '../main'
import { resEffectName } from "../../effect"
import { DOBON_CARD_NUMBER_WILD } from "../../../../constant"
import { resetEvent } from "../../../../server/cpuModeHandler"

interface Args {
  user: NestedPartial<Player>
  io: CpuMainProcessArgs['io']
  hands: string[] | HandCards[]
  trash: string[]
  data: CpuTurnEmitData
  adapterPubClient: CpuMainProcessArgs['adapterPubClient']
  pveKey: CpuMainProcessArgs['pveKey']
  trashKey: string
  handsKey: string
}

/**
 * 手札を出せる場合
 *  - 出せるカード毎のリスクを計算
 *  - CPUレベルで定義されたリスク値を下回る場合はカードを出す
 *  - ジョーカーは手元に持つ方が有利なので出さない
 * 手札を出せない場合
 *  - スキップする
 */
const putoutPhase = async({
  user, io, hands, trash, data, adapterPubClient, pveKey, trashKey, handsKey
}: Args) => {
  const {turn, users, effect} = data.data
  if (!turn) {
    throw Error('putoutPhase has Error: required data is not provided')
  }
  let updateHands = [...hands]
  let nextTurn; // eslint-disable-line init-declarations

  // 手札を場に出せるかを判定する
  const putableCards = cardsICanPutOut(hands, trash[0], effect)

  // 出せない場合はスキップ
  if (!putableCards.length) {
    const isReversed = (typeof effect !== 'undefined') && effect.includes('reverse')
    nextTurn = culcNextUserTurn(turn, users, '', isReversed)
    const reducerPayload: reducerPayloadSpecify = {
      game: {
        board: {
          turn: nextTurn,
        }
      }
    }
    await sleep(500)
    io.in(pveKey).emit('updateStateSpecify', reducerPayload)
    return
  }

  // 試しに最初のカードを出す
  await sleep(500)
  const trashCard = putableCards[0]
  console.log(trashCard, 'trashCard')
  adapterPubClient.lpush(trashKey, trashCard.replace('o', '')) // 最新の捨て札を先頭に追加(oは除いておく)
  adapterPubClient.srem(handsKey, trashCard)

  updateHands = updateHands.filter(card => card !== trashCard)
  const comHandsIndex = data.data.otherHands.findIndex(hand => hand.nickname === user.nickname)
  data.data.otherHands[comHandsIndex].hands = updateHands

  // 8(wild)を出す場合、自分の手札に最も多い柄を選択(TODO：柄選択にもロジックを追加する)
  const sepTrash = sepalateSuitNum([trashCard])[0]
  const is8 = Number(sepTrash.num) === DOBON_CARD_NUMBER_WILD

  let mostOwnedSuit: any = ''
  if (is8) {
    const searchSuits: {[key:string]: number} = { c:0, d:0, h:0, s:0 }
    const rmTrashHand = hands.filter(card => card !== trashCard) // これから出すカード以外の手札
    const suitArray = sepalateSuitNum(rmTrashHand).map(card => card.suit) // ['c', 'd', 'h', 's']の可変長配列となる

    for (const [key, _] of Object.entries(searchSuits)) { // eslint-disable-line no-unused-vars
      const cnt = suitArray.filter(item => item === key).length
      searchSuits[key] = cnt

      if (key === 'c' || searchSuits[mostOwnedSuit] < cnt) {
        mostOwnedSuit = key
      }
    }
  }

  const effectName = resEffectName({ card:[trashCard], selectedWildCard: { isSelected: true, suit: mostOwnedSuit } })
  if (effectName) {
    data.data.effect.push(effectName)
  }

  const reducerPayload: reducerPayloadSpecify = {
    game: {
      board: {
        effect: data.data.effect,
        trash: {
          card: `${trashCard}o`,
          user,
        },
        allowDobon: true,
        turn: culcNextUserTurn(turn, users, '', false),
        otherHands: data.data.otherHands,
      },
      event: effectName ? { user, action: effectName } : undefined
    }
  }
  io.in(pveKey).emit('updateStateSpecify', reducerPayload) // Room全員の捨て札を更新

  await sleep(1000)
  resetEvent(io, pveKey) // モーダル表示を終了させるためにクライアント側のstateを更新
}

export { putoutPhase }