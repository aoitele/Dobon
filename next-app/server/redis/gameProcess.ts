import { Redis } from "ioredis"

/**
 * Redisに保存している手札情報のリセット処理
 */
const redisHandsInit = async(adapterPubClient: Redis, deckKey:string, handsKey: string) => {
  adapterPubClient.del(handsKey) // eslint-disable-line no-await-in-loop
  // for debug
  // const isMe = !!(handsKey.match(/user:me/))
  // const isCOM1 = !!(handsKey.match(/user:com1/))
  // const isCOM2 = !!(handsKey.match(/user:com2/))
  // const isCOM3 = !!(handsKey.match(/user:com3/))
  // const hands = isMe ? ['s1','s2','s3','s4','d3'] : await adapterPubClient.spop(deckKey, 5) // eslint-disable-line no-await-in-loop
  // const hands = isMe || isCOM1 ? ['s1','s2','s3','s4','d3'] : await adapterPubClient.spop(deckKey, 5) // eslint-disable-line no-await-in-loop
  // const hands = isMe || isCOM1 || isCOM2  ? ['s1','s2','s3','s4','d3'] : await adapterPubClient.spop(deckKey, 5) // eslint-disable-line no-await-in-loop
  // const hands = isMe ? ['s1','s2','s3','s4','d3'] : await adapterPubClient.spop(deckKey, 5) // eslint-disable-line no-await-in-loop
  const hands = await adapterPubClient.spop(deckKey, 5) // eslint-disable-line no-await-in-loop
  adapterPubClient.sadd(handsKey, hands)
  return hands
}

/**
 * Redisに保存しているTrash情報のリセット処理
 */
const redisTrashInit = async(adapterPubClient: Redis, deckKey:string, trashKey: string) => {
  adapterPubClient.del(trashKey)
  const trash = await adapterPubClient.spop(deckKey, 1)
  adapterPubClient.lpush(trashKey, trash)
  const initialTrash = `${trash[0]}o` // フロント返却時はOpen状態にする
  // const initialTrash = `d13o` // for debug
  return initialTrash
}

export { redisHandsInit, redisTrashInit }