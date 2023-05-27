import { HandCards } from "../../../../@types/card"
import { OtherHands, Player } from "../../../../@types/game"
import { NestedPartial } from "../../../../@types/utility"
import { CpuTurnEmitData } from "../../../../@types/emitData"
import { cardsICanPutOut, sepalateSuitNum } from "../../checkHand"
import { reducerPayloadSpecify } from "../../roomStateReducer"
import sleep from "../../sleep"
import { CpuMainProcessArgs } from '../main'
import { resEffectName } from "../../effect"
import { DOBON_CARD_NUMBER_WILD } from "../../../../constant"
import { resetEvent } from "../../../../server/cpuModeHandler"
import { loadDobonRedisKeys } from "../../../../server/redis/loadDobonRedisKeys"
import { dobonJudge } from "../../dobonJudge"
import { gameInitialState } from "../../../../context/state/gameInitialState"
import main from "../thinking/putout/main"

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
  speed: CpuMainProcessArgs['speed']
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
  user, io, hands, trash, data, adapterPubClient, pveKey, trashKey, handsKey, haveNum, speed
}: Args) => {
  const {turn, effect, otherHands } = data.data
  if (!turn) {
    throw Error('PutOut Phase : has Error: required data is not provided')
  }
  let updateHands = [...hands]

  // 手札を場に出せるかを判定する
  const putableCards = cardsICanPutOut(hands, trash[0], effect)
  console.log(putableCards, 'putableCards')

  // 出せない場合はスキップ
  if (!putableCards.length) {
    const reducerPayload: reducerPayloadSpecify = {
      game: {
        board: {
          allowDobon: false,
          status: 'turnChanging',
        },
        event: gameInitialState.game.event,
      }
    }
    console.log(`\n--- COM TURN END for SKIP ---\n`)
    io.in(pveKey).emit('updateStateSpecify', reducerPayload)
    return
  }

  // (2か13の)カード効果をeffectPhaseで回避している場合は、回避用のカードを優先して出す
  const trashCard = haveNum
  ? putableCards.filter(card => sepalateSuitNum([card])[0].num === sepalateSuitNum([trash[0]])[0].num)[0]
  : putableCards[0]
  console.log(`PutOut Phase :haveNum - ${haveNum}`)

  // 効果解決でない場合はカードを選択して出す(TODO：選択ロジック実装)
  const waitTime1 = speed === '1x' ? 420 : speed === '2x' ? 210 : 140
  await sleep(waitTime1) // CPUターンに間をつけるためのsleep

  console.log(`\n--- COM DETECTION START ---\n`)
  // 操作プレイヤーの手札情報
  const playerHands: OtherHands = {
    userId: 0,
    hands: data.data.hands,
    nickname: 'me'
  }
  const allUserHands = [playerHands, ...otherHands]

  const ownHands = allUserHands.find(hand => hand.nickname === user.nickname)
  const otherPLayersHands = allUserHands.filter(hand => hand.nickname !== user.nickname)

  if (!ownHands) {
    throw Error('PutOut Phase : has Error: ownHands data is not provided')
  }
  main({ ownHands, otherHands:otherPLayersHands })
  console.log(`\n--- COM DETECTION END ---\n`)

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

  // 効果カードを出した場合はクライアント側でエフェクトを見せるためeffectNameを取得する
  const effectName = resEffectName({ card:[trashCard], selectedWildCard: { isSelected: true, suit: mostOwnedSuit } })
  console.log(`PutOut Phase : trash card effect - ${effectName}`)

  // playerユーザーがドボン可能なカードを出した時はターンを更新せずドボン判断フェイズを挟ませる
  const [handKey] = loadDobonRedisKeys([
    { mode:'pve', type: 'hands', firstKey: pveKey, secondKey: 'me' },
  ])
  const userMeHand = await adapterPubClient.smembers(handKey)
  const canIDobon = dobonJudge(trashCard, userMeHand)

  // 捨て札はo(公開状態)で場に出す、元々oがついている手札を出す場合を考慮してtrashCard文字列を生成
  const trashCardStr = sepTrash.isOpen ? trashCard : `${trashCard}o`

  let reducerPayload: reducerPayloadSpecify = {
    game: {
      board: {
        effect: data.data.effect,
        trash: {
          card: trashCardStr,
          user,
        },
        otherHands: data.data.otherHands,
        allowDobon: true,
        waitDobon: canIDobon ? true : undefined,
      },
      event: effectName ? { user: [user], action: effectName } : gameInitialState.game.event,
    }
  }
  io.in(pveKey).emit('updateStateSpecify', reducerPayload)

  if (effectName) {
    await sleep(1000)
    resetEvent(io, pveKey) // モーダル表示を終了させるためにクライアント側のstateを更新
  }

  // 自分がドボンできる場合はwaitDobonの判定操作を待つため、dobonCheckフェイズには移行させない
  if (!canIDobon) {
    reducerPayload = { game: { board: { status: 'dobonCheck' } } }
    io.in(pveKey).emit('updateStateSpecify', reducerPayload)
  }
  console.log(`\n--- COM TURN END ---\n`)
}

export { putoutPhase }