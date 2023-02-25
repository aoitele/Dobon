import { HandCards } from "../../../../@types/card"
import { Player } from "../../../../@types/game"
import { NestedPartial } from "../../../../@types/utility"
import { CpuTurnEmitData } from "../../../../@types/emitData"
import { cardsICanPutOut, sepalateSuitNum } from "../../checkHand"
import { reducerPayloadSpecify } from "../../roomStateReducer"
import sleep from "../../sleep"
import { culcNextUserTurn } from "../../turnInfo"
import { CpuMainProcessArgs } from '../main'
import { isAddableEffect, resEffectName, resNewEffectState } from "../../effect"
import { DOBON_CARD_NUMBER_WILD } from "../../../../constant"
import { resetEvent } from "../../../../server/cpuModeHandler"
import { loadDobonRedisKeys } from "../../../../server/redis/loadDobonRedisKeys"
import { dobonJudge } from "../../dobonJudge"

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
  haveNum?: boolean
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
  user, io, hands, trash, data, adapterPubClient, pveKey, trashKey, handsKey, haveNum
}: Args) => {
  const {turn, users, effect} = data.data
  if (!turn) {
    throw Error('PutOut Phase : has Error: required data is not provided')
  }
  let updateHands = [...hands]
  let nextTurn; // eslint-disable-line init-declarations

  // 手札を場に出せるかを判定する
  const putableCards = cardsICanPutOut(hands, trash[0], effect)
  console.log(putableCards, 'putableCards')

  // 出せない場合はスキップ
  if (!putableCards.length) {
    const isReversed = (typeof effect !== 'undefined') && effect.includes('reverse')
    nextTurn = culcNextUserTurn(turn, users, '', isReversed)
    const reducerPayload: reducerPayloadSpecify = {
      game: {
        board: {
          turn: nextTurn,
          allowDobon: false,
        }
      }
    }
    console.log(`\n--- COM TURN END for SKIP ---\n`)
    await sleep(500)
    io.in(pveKey).emit('updateStateSpecify', reducerPayload)

    return
  }

  // カード効果をeffectPhaseで回避している場合は、回避用のカードを優先して出す
  const trashCard = haveNum
  ? putableCards.filter(card => sepalateSuitNum([card])[0].num === sepalateSuitNum([trash[0]])[0].num)[0]
  : putableCards[0]
  console.log(`PutOut Phase :haveNum - ${haveNum}`)

  // 効果解決でない場合はカードを選択して出す(TODO：選択ロジック実装)
  await sleep(500)
  console.log(`PutOut Phase : user:${user.nickname} trash - ${trashCard}`)
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
    console.log(`PutOut Phase : user:${user.nickname} select suit - ${mostOwnedSuit}`)
  }

  // 場の効果を解決、trashが追加すべき効果カードであればeffectに追加する
  const effectName = resEffectName({ card:[trashCard], selectedWildCard: { isSelected: true, suit: mostOwnedSuit } })
  const existsEffect = data.data.effect.length > 0
  const isReversed = data.data.effect.includes('reverse') // 解決前の反転状態を取得して後続のculcNextUserTurnに次ターンを計算させている
  console.log(`PutOut Phase : trash card effect - ${effectName}`)
  console.log(`PutOut Phase : isReversed before resolve effect - ${isReversed}`)

  if (existsEffect) {
    const newEffectState = resNewEffectState(data.data.effect, effectName)
    data.data.effect = newEffectState
    console.log(`PutOut Phase : new Effect state - ${newEffectState}`)
  } else if(effectName) {
    if (isAddableEffect(effectName)){
      data.data.effect.push(effectName)
      console.log(`PutOut Phase : add Effect - ${effectName}`)
    }
  }

  // playerユーザーがドボン可能なカードを出した時はターンを更新せずドボン判断フェイズを挟ませる
  const [handKey] = loadDobonRedisKeys([
    { mode:'pve', type: 'hands', firstKey: pveKey, secondKey: 'me' },
  ])
  const userMeHand = await adapterPubClient.smembers(handKey)
  const canIDobon = dobonJudge(trashCard, userMeHand)

  let reducerPayload: reducerPayloadSpecify = {
    game: {
      board: {
        effect: data.data.effect,
        trash: {
          card: `${trashCard}o`,
          user,
        },
        otherHands: data.data.otherHands,
        waitDobon: canIDobon ? true : undefined
      },
      event: effectName ? { user: [user], action: effectName } : undefined
    }
  }
  io.in(pveKey).emit('updateStateSpecify', reducerPayload)

  if (effectName) {
    await sleep(1000)
    resetEvent(io, pveKey) // モーダル表示を終了させるためにクライアント側のstateを更新
  }

  if (!canIDobon) {
    // エフェクトモーダル終了後にターンを変更させる
    reducerPayload = {
      game: {
        board: {
          turn: culcNextUserTurn(turn, users, effectName, isReversed),
        }
      }
    }
    io.in(pveKey).emit('updateStateSpecify', reducerPayload) // Room全員の捨て札を更新
  }
  console.log(`\n--- COM TURN END ---\n`)
}

export { putoutPhase }