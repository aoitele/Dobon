import { HandCards } from "../../../../@types/card"
import { Player } from "../../../../@types/game"
import { NestedPartial } from "../../../../@types/utility"
import { sepalateSuitNum } from "../../checkHand"
import { extractShouldBeSolvedEffect } from "../../effect"
import { reducerPayloadSpecify } from "../../roomStateReducer"
import sleep from "../../sleep"
import { CpuMainProcessArgs } from '../cpuMainProcess'
import { AddDecitionScoreResponse, decidePutOut } from "../thinking/putout/decidePutOut"

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
  decition: AddDecitionScoreResponse['decition']
}

const effectPhase = async({
  user, io, hands, trash, data, adapterPubClient, pveKey, deckKey, handsKey, trashKey, speed, decition
}: Args) => {
  if (!data.data.otherHands || !user.mode) {
    throw Error('drawPhase has Error: data.data.otherHands is not provided')
  }

  // ドロー効果/手札公開効果がなければ何もせずドローフェイズへ
  const effect = extractShouldBeSolvedEffect(data.data.effect)[0]
  if (!effect) {
    console.log('Effect Phase : SKIP - no ShouldBeSolvedEffect')
    return { updateData1: data, updateHands1: hands }
  }

  // 手札を出せる場合は回避してドローフェイズへ
  if (decition.length) {
    // CPU難易度に設定された被ドボンリスクの閾値より低ければ、同数字のカードを出して回避する
    const trashNum = sepalateSuitNum([trash[0]])[0].num
    const isPutOut = decidePutOut({ trash, decition, mode: user.mode, phase: 'putOut', sameNumberOnly: true })
    if (isPutOut) {
      console.log('Effect Phase : SKIP - have num WITH decition')
      return { updateData1: data, updateHands1: hands, haveNum: true }
    }
    console.log(`\n\n\nEffect Phase : NOT SKIP - ${trashNum} thought high lisk!\n\n\n`)
  }

  // 以降、効果を受ける処理

  // 効果を受けた情報をクライアントへ通知
  let reducerPayload: reducerPayloadSpecify = {
    game: {
      event: {
        user: [{nickname: user.nickname, turn: user.turn}],
        message: `affected ${effect}!`
      }
    }
  }
  io.in(pveKey).emit('updateStateSpecify', reducerPayload)

  let updateHands = [...hands]
  let drawCnt = 0

  switch(effect) {
    case 'draw2':
    case 'draw4':
    case 'draw6':
    case 'draw8': {
      // ドロー実行
      drawCnt = Number(effect.substring(effect.length - 1))
      const deckCountBefore = await adapterPubClient.scard(deckKey)
      const willDeckBeEmpty = deckCountBefore - drawCnt <= 0

      if (willDeckBeEmpty) {
        // ドローによりデッキが0枚になる場合、デッキを再生成する
        const lastDeckCards = await adapterPubClient.spop(deckKey, deckCountBefore) // デッキに残っているカードを取得
        const trashCards = await adapterPubClient.lrange(trashKey, 1, -1) // 最後の捨て札(先頭)を除くカードを取得
        adapterPubClient.sadd(deckKey, trashCards) // deckにtrashcardを戻す(順番はランダムに追加される)
        adapterPubClient.ltrim(trashKey, 0, 0) // Trashは先頭だけ残す
        const newCards = await adapterPubClient.spop(deckKey, drawCnt - deckCountBefore)
        const adds = [...lastDeckCards, ...newCards]
        adapterPubClient.sadd(handsKey, adds)
        updateHands.push(...adds)
        // data.data.deckCount = trashCards.length - (drawCnt - deckCountBefore)
      } else {
        const newCard = await adapterPubClient.spop(deckKey, drawCnt)
        adapterPubClient.sadd(handsKey, newCard)
        updateHands.push(...newCard)
        // data.data.deckCount -= drawCnt
      }
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
  const deckCount = await adapterPubClient.scard(deckKey)

  reducerPayload = {
    game: {
      board: {
        effect: data.data.effect,
        otherHands: data.data.otherHands,
        deckCount,
      }
    }
  }
  io.in(pveKey).emit('updateStateSpecify', reducerPayload)

  const waitTime = speed === '1x' ? 420 : speed === '2x' ? 210 : 140
  await sleep(waitTime)

  return {
    updateData1: { ...data, hands: updateHands },
    updateHands1: updateHands,
  }
}

export { effectPhase }