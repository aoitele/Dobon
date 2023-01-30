import { Redis } from "ioredis"
import { Socket } from "socket.io"
import { loadDobonRedisKeys } from "../../../server/redis/loadDobonRedisKeys"
import { CpuTurnEmitData } from "../../validator/emitData"
import { drawPhase } from "./phase/drawPhase"
import { putoutPhase } from "./phase/putoutPhase"

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
  console.log('cpuMainProcess start...')

  const user = data.data.users?.find(user => user.turn === data.data.turn)
  if (!user?.nickname) {
    throw Error('cpuMainProcess has Error: required data is not provided')
  }

  const [deckKey, trashKey, handsKey] = loadDobonRedisKeys([
    { mode:'pve', type: 'deck', firstKey: pveKey },
    { mode:'pve', type: 'trash', firstKey: pveKey },
    { mode:'pve', type: 'hands', firstKey: pveKey, secondKey: user.nickname },
  ])

  const redisData = await adapterPubClient.pipeline()
    .smembers(deckKey)
    .lrange(trashKey, 0, -1)
    .smembers(handsKey)
    .exec((_err, results) => results)
  const [_deck, trash, hands] = [redisData[0][1], redisData[1][1], redisData[2][1]]

  const { updateData, updateHands } = await drawPhase({ user, io, hands, trash, data, adapterPubClient, pveKey, deckKey, trashKey, handsKey })
  await putoutPhase({ user, io, hands: updateHands, trash, data: updateData, adapterPubClient, pveKey, deckKey, trashKey, handsKey })
}

export { cpuMainProcess }