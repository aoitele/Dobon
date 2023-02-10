import { HandCards } from "../../../../@types/card"
import { Player } from "../../../../@types/game"
import { NestedPartial } from "../../../../@types/utility"
import { sepalateSuitNum } from "../../checkHand"
import { extractShouldBeSolvedEffect } from "../../effect"
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
  handsKey: string
}

const effectPhase = async({
  user, io, hands, trash, data, adapterPubClient, pveKey, deckKey, handsKey
}: Args) => {
  if (!data.data.otherHands) {
    throw Error('drawPhase has Error: data.data.otherHands is not provided')
  }

  // ドロー効果/手札公開効果がなければ何もせずドローフェイズへ
  const effect = extractShouldBeSolvedEffect(data.data.effect)[0]
  if (!effect) {
    console.log('skip effect phase - no effect')
    return { updateData1: data, updateHands1: hands }
  }

  // 手札を出せる場合は回避してドローフェイズへ
  const cardNum = sepalateSuitNum([trash[0]])[0].num
  const _hands = sepalateSuitNum(hands).map(card => card.num)

  if (_hands.includes(cardNum)) {
    console.log('skip effect phase - have num')
    return { updateData1: data, updateHands1: hands }
  }

  // 以降、効果を受ける場合
  const updateHands = [...hands]

  switch(effect) {
    case 'draw2':
    case 'draw4':
    case 'draw6':
    case 'draw8': {
      // ドロー実行
      const drawCnt = effect.substring(effect.length - 1)
      const newCard = await adapterPubClient.spop(deckKey, Number(drawCnt))
      adapterPubClient.sadd(handsKey, newCard)
      updateHands.push(...newCard)

      // 手札情報、エフェクト情報を更新
      const comHandsIndex = data.data.otherHands.findIndex(hand => hand.nickname === user.nickname)
      data.data.otherHands[comHandsIndex].hands = updateHands
      data.data.effect = data.data.effect.filter(item => item !== effect)
 
      const reducerPayload: reducerPayloadSpecify = {
        game: {
          board: {
            effect: data.data.effect,
            otherHands: data.data.otherHands,
            deckCount: data.data.deckCount - Number(drawCnt),
          }
        }
      }
      io.in(pveKey).emit('updateStateSpecify', reducerPayload)
      break;
    }
    case 'opencard': {
      break;
    }
    default: break;
  }

  await sleep(1000)

  return {
    updateData1: { ...data, hands: updateHands },
    updateHands1: updateHands,
  }
}

export { effectPhase }