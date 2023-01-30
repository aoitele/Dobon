import { HandCards } from "../../../../@types/card"
import { Player } from "../../../../@types/game"
import { NestedPartial } from "../../../../@types/utility"
import { cardsICanPutOut } from "../../checkHand"
import { reducerPayloadSpecify } from "../../roomStateReducer"
import sleep from "../../sleep"
import { CpuMainProcessArgs } from '../main'

interface Args {
  user: NestedPartial<Player>
  io: CpuMainProcessArgs['io']
  hands: string[] | HandCards[]
  trash: string[]
  data: CpuMainProcessArgs['data']
  adapterPubClient: CpuMainProcessArgs['adapterPubClient']
  pveKey: CpuMainProcessArgs['pveKey']
  deckKey: string
  trashKey: string
  handsKey: string
}

const drawPhase = async({
  user, io, hands, trash, data, adapterPubClient, pveKey, deckKey, trashKey, handsKey
}: Args) => {
  console.log(hands, 'hands')
  if (!data.data.otherHands) {
    throw Error('drawPhase has Error: data.data.otherHands is not provided')
  }

  const updateHands = [...hands]
  // 手札を場に出せるかを判定する
  const putableCards = cardsICanPutOut(hands, trash[0], data.data.effect)
  console.log(putableCards, 'putableCards')

  // 手札を出せない場合はドローする
  if (!putableCards.length) {
    const newCard = await adapterPubClient.spop(deckKey, 1)
    adapterPubClient.sadd(handsKey, newCard)
    updateHands.push(...newCard)
    const comHandsIndex = data.data.otherHands.findIndex(hands => hands.nickname === user.nickname)
    data.data.otherHands[comHandsIndex]['hands'] = updateHands
    // 手札情報を更新
    await sleep(1000)
    const reducerPayload: reducerPayloadSpecify = {
      game: {
        board: {
          otherHands: data.data.otherHands,
          deckCount: data.data.deckCount - 1,
        }
      }
    }
    io.in(pveKey).emit('updateStateSpecify', reducerPayload)
  }
  return {
    updateData: data,
    updateHands,
  }
}

export { drawPhase }