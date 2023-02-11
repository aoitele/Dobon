import { Redis } from "ioredis"
import { Socket } from "socket.io"
import { loadDobonRedisKeys } from "../../../server/redis/loadDobonRedisKeys"
import { CpuTurnEmitData } from "../../../@types/emitData"
import { drawPhase } from "./phase/drawPhase"
import { putoutPhase } from "./phase/putoutPhase"
import { effectPhase } from "./phase/effectPhase"

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
}

const cpuMainProcess = async ({ io, adapterPubClient, pveKey, data }: CpuMainProcessArgs) => {
  console.log(`\n--- COM TURN START ---\n`)

  const player = data.data.users?.find(user => user.turn === data.data.turn)
  if (!player?.nickname) {
    throw Error('cpuMainProcess has Error: required data is not provided')
  }

  const [deckKey, trashKey, handsKey] = loadDobonRedisKeys([
    { mode:'pve', type: 'deck', firstKey: pveKey },
    { mode:'pve', type: 'trash', firstKey: pveKey },
    { mode:'pve', type: 'hands', firstKey: pveKey, secondKey: player.nickname },
  ])

  const redisData = await adapterPubClient.pipeline()
    .lrange(trashKey, 0, -1)
    .smembers(handsKey)
    .exec((_err, results) => results)
  const [trash, hands] = [redisData[0][1], redisData[1][1]]

  const { updateData1, updateHands1 } = await effectPhase({ user: player, io, hands, trash, data, adapterPubClient, pveKey, deckKey, handsKey })
  const { updateData2, updateHands2 } = await drawPhase({ user: player, io, hands: updateHands1, trash, data: updateData1, adapterPubClient, pveKey, deckKey, handsKey })
  await putoutPhase({ user: player, io, hands: updateHands2, trash, data: updateData2, adapterPubClient, pveKey, trashKey, handsKey })
}

export { cpuMainProcess }