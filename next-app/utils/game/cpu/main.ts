import { Redis } from "ioredis"
import { Socket } from "socket.io"
import { EmitBoard } from "../../../@types/socket"
import { loadDobonRedisKeys } from "../../../server/redis/loadDobonRedisKeys"
import { drawPhase } from "./phase/drawPhase"

/**
 * CPUのゲーム実行プロセス
 * 1. ドボン実行判断
 * 2. (カード効果があれば) 処理判断
 * 3. ドロー or 手札を出す
 * 4. (1でドローした場合) スキップ or 手札を出す
 */
export interface CpuMainProcessArgs {
  io: Socket
  adapterPubClient: Redis
  pveKey:string
  data: EmitBoard
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

  await drawPhase({ user, io, hands, trash, data, adapterPubClient, pveKey, deckKey, trashKey, handsKey })
}

export { cpuMainProcess }