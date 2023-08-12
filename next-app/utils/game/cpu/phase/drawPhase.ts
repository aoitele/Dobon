import { HandCards } from "../../../../@types/card"
import { Player } from "../../../../@types/game"
import { NestedPartial } from "../../../../@types/utility"
import { cardsICanPutOut } from "../../checkHand"
import { reducerPayloadSpecify } from "../../roomStateReducer"
import sleep from "../../sleep"
import { CpuMainProcessArgs } from '../cpuMainProcess'

interface Args {
  user: NestedPartial<Player>
  io: CpuMainProcessArgs['io']
  hands: string[] | HandCards[]
  trash: string[]
  data: CpuMainProcessArgs['data']
  adapterPubClient: CpuMainProcessArgs['adapterPubClient']
  pveKey: CpuMainProcessArgs['pveKey']
  deckKey: string
  handsKey: string
  trashKey: string
  speed: CpuMainProcessArgs['speed']
}

const drawPhase = async({
  user, io, hands, trash, data, adapterPubClient, pveKey, deckKey, handsKey, trashKey, speed
}: Args) => {
  if (!data.data.otherHands) {
    throw Error('Draw Phase : has Error: data.data.otherHands is not provided')
  }

  const updateHands = [...hands]
  // 手札を場に出せるかを判定する
  const putableCards = cardsICanPutOut(hands, trash[0], data.data.effect)

  // 手札を出せない場合はドローする
  if (!putableCards.length) {
    const deckCountBefore = await adapterPubClient.scard(deckKey)
    const willDeckBeEmpty = deckCountBefore === 0
    // ドローによりデッキが0枚になる場合、デッキを再生成する
    if (willDeckBeEmpty) {
      const trashCards = await adapterPubClient.lrange(trashKey, 1, -1) // 最後の捨て札(先頭)を除くカードを取得
      await adapterPubClient.sadd(deckKey, trashCards) // deckにtrashcardを戻す(順番はランダムに追加される)
      adapterPubClient.ltrim(trashKey, 0, 0) // Trashは先頭だけ残す
    }

    const newCard = await adapterPubClient.spop(deckKey, 1)
    adapterPubClient.sadd(handsKey, newCard)
    updateHands.push(...newCard)
    const comHandsIndex = data.data.otherHands.findIndex(hand => hand.nickname === user.nickname)
    data.data.otherHands[comHandsIndex].hands = updateHands
    const deckCount = willDeckBeEmpty ? await adapterPubClient.scard(deckKey) : data.data.deckCount - 1

    // 手札情報を更新
    const waitTime = speed === '1x' ? 420 : speed === '2x' ? 210 : 140
    await sleep(waitTime)
    const reducerPayload: reducerPayloadSpecify = {
      game: {
        board: {
          otherHands: data.data.otherHands,
          deckCount,
        }
      }
    }
    io.in(pveKey).emit('updateStateSpecify', reducerPayload)
    console.log(`\nDraw Phase : user:${user.nickname} draw - ${newCard}\n`)
  }
  return {
    updateData2: data,
    updateHands2: updateHands,
  }
}

export { drawPhase }