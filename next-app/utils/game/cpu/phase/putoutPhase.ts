import { HandCards } from "../../../../@types/card"
import { Player } from "../../../../@types/game"
import { NestedPartial } from "../../../../@types/utility"
import { CpuTurnEmitData } from "../../../../@types/emitData"
import { cardsICanPutOut } from "../../checkHand"
import { reducerPayloadSpecify } from "../../roomStateReducer"
import sleep from "../../sleep"
import { culcNextUserTurn } from "../../turnInfo"
import { CpuMainProcessArgs } from '../main'

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
      }
    }
  }
  io.in(pveKey).emit('updateStateSpecify', reducerPayload) // Room全員の捨て札を更新
}

export { putoutPhase }