import { HandCards } from "../../../../@types/card"
import { Player } from "../../../../@types/game"
import { NestedPartial } from "../../../../@types/utility"
import { CpuTurnEmitData } from "../../../validator/emitData"
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
  deckKey: string
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
  user, io, hands, trash, data, adapterPubClient, pveKey, deckKey, trashKey, handsKey
}: Args) => {
  const {turn, users, effect, otherHands} = data.data 
  if (!turn) {
    throw Error('putoutPhase has Error: required data is not provided')
  }
  // 手札を場に出せるかを判定する
  const putableCards = cardsICanPutOut(hands, trash[0], effect)
  console.log(putableCards, 'putableCards')

  if (!putableCards.length) {
    console.log('----- skip -----')
    const isReversed = (typeof effect !== 'undefined') && effect.includes('reverse')
    const nextTurn = culcNextUserTurn(turn, users, '', isReversed)
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
}

export { putoutPhase }