import { Redis } from "ioredis"
import { Socket } from "socket.io"
import { loadDobonRedisKeys } from "../../../server/redis/loadDobonRedisKeys"
import { CpuTurnEmitData } from "../../../@types/emitData"
import { drawPhase } from "./phase/drawPhase"
import { putoutPhase } from "./phase/putoutPhase"
import { effectPhase } from "./phase/effectPhase"
import { GameProviderState } from "../../../context/GameProvider"
import { OtherHands } from "../../../@types/game"
import main from "./thinking/putout/main"
import { decidePutOut } from "./thinking/putout/decidePutOut"
import { cardsICanPutOut } from "../checkHand"

/**
 * CPUのゲーム実行プロセス
 * 1. ドボン実行判断
 * 2. (カード効果があれば) 処理判断
 * 3. ドロー(手札を出せない or 出さない方が良い場合)
 * 4. スキップ or 手札を出す
 */
export interface CpuMainProcessArgs {
  io: Socket
  adapterPubClient: Redis
  pveKey:string
  data: CpuTurnEmitData
  speed: GameProviderState['game']['board']['speed']
}

const cpuMainProcess = async ({ io, adapterPubClient, pveKey, data, speed }: CpuMainProcessArgs) => {
  console.log(`\n--- COM TURN START turn: ${data.data.turn} ---\n`)

  const player = data.data.users?.find(user => user.turn === data.data.turn)
  if (!player?.nickname || !player.mode) {
    throw Error('cpuMainProcess has Error: required data is not provided')
  }

  const [deckKey, trashKey, handsKey] = loadDobonRedisKeys([
    { mode:'pve', type: 'deck', firstKey: pveKey },
    { mode:'pve', type: 'trash', firstKey: pveKey },
    { mode:'pve', type: 'hands', firstKey: pveKey, secondKey: player.nickname },
  ])

  const redisData = await adapterPubClient.pipeline()
    .scard(deckKey)
    .lrange(trashKey, 0, -1)
    .smembers(handsKey)
    .exec((_err, results) => results)
  const [deckCount, trash, hands]:[number, string[], any] = [redisData[0][1], redisData[1][1], redisData[2][1]]

  /**
   * 各処理フェイズに入る前段階で被ドボン/ダメージ/ポジティブ値のリスク計算を行う
   */
  console.log(`\n--- COM DETECTION START ---\n`)
  const nonCPUHands: OtherHands = { userId: 0, hands: data.data.hands, nickname: 'me' } // 操作プレイヤーの手札情報
  const allUserHands = [nonCPUHands, ...data.data.otherHands]
  const ownHands = allUserHands.filter(hand => hand.nickname === player.nickname)[0] // ターン実行中CPUの手札情報
  const otherPlayersHands = allUserHands.filter(hand => hand.nickname !== player.nickname) // ターン実行していないユーザーの手札情報

  const detectionInfo = main({ ownHands, otherHands:otherPlayersHands, trashedMemory: trash, deckCount })
  console.log(`\n--- COM DETECTION END ---\n`)
  const putableCards = cardsICanPutOut(ownHands.hands, trash[0], data.data.effect)
  const decition1 = decidePutOut({ cpuLevel: player.mode, detectionInfo, putableCards })
  console.log(decition1, 'decition1')

  /**
   * カードが出せる場合
   * 手札のカードを出すかどうか？ → リスクが一定値を超えた場合は出さずにドローする
   * 一定値以下のリスクカードがある場合
   */

  const { updateData1, updateHands1, haveNum } = await effectPhase({ user: player, io, hands, trash, data, adapterPubClient, pveKey, deckKey, handsKey, trashKey, speed, detectionInfo })
  const { updateData2, updateHands2 } = await drawPhase({ user: player, io, hands: updateHands1, trash, data: updateData1, adapterPubClient, pveKey, deckKey, handsKey, trashKey, speed })
  await putoutPhase({ user: player, io, hands: updateHands2, trash, data: updateData2, adapterPubClient, pveKey, trashKey, handsKey, haveNum, speed })
}

export { cpuMainProcess }