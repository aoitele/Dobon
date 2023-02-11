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
    console.log('Effect Phase : SKIP - no effect')
    return { updateData1: data, updateHands1: hands }
  }

  // 手札を出せる場合は回避してドローフェイズへ
  const cardNum = sepalateSuitNum([trash[0]])[0].num
  const _hands = sepalateSuitNum(hands).map(card => card.num)

  if (_hands.includes(cardNum)) {
    console.log('Effect Phase : SKIP - have num')
    return { updateData1: data, updateHands1: hands }
  }

  // 以降、効果を受ける場合
  let updateHands = [...hands]
  let drawCnt = 0

  switch(effect) {
    case 'draw2':
    case 'draw4':
    case 'draw6':
    case 'draw8': {
      // ドロー実行
      drawCnt = Number(effect.substring(effect.length - 1))
      const newCard = await adapterPubClient.spop(deckKey, drawCnt)
      adapterPubClient.sadd(handsKey, newCard)
      updateHands.push(...newCard)
      console.log(`Effect Phase : user:${user.nickname} accept effect - ${effect}`)
      break
    }
    case 'opencard': {
      // カードを公開状態に変更
      const re = /[a-z][0-9]+o/gu
      updateHands = hands.map(card => {
        const mat = card.match(re)
        if (mat) return card // 既に公開状態であればそのまま返す
        return card.includes('p') ? `${card.replace('p', 'op')}` : `${card}o` // 出せるカードであればopを付加して返す
      })
      adapterPubClient.pipeline()
      .del(handsKey)
      .sadd(handsKey, updateHands)
      .exec((_err, results) => results)
      console.log(`Effect Phase : user:${user.nickname} accept effect - ${effect}`)
      break
    }
    default: break;
  }

  // 手札情報、エフェクト情報を更新
  const comHandsIndex = data.data.otherHands.findIndex(hand => hand.nickname === user.nickname)
  data.data.otherHands[comHandsIndex].hands = updateHands
  data.data.effect = data.data.effect.filter(item => item !== effect)

  const reducerPayload: reducerPayloadSpecify = {
    game: {
      board: {
        effect: data.data.effect,
        otherHands: data.data.otherHands,
        deckCount: drawCnt ? data.data.deckCount - drawCnt : data.data.deckCount,
      }
    }
  }
  io.in(pveKey).emit('updateStateSpecify', reducerPayload)

  await sleep(1000)

  return {
    updateData1: { ...data, hands: updateHands },
    updateHands1: updateHands,
  }
}

export { effectPhase }