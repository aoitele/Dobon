import { Redis } from "ioredis"
import { Socket } from "socket.io-client"
import { Board, Player } from "../@types/game"
import { EmitForPVE } from "../@types/socket"
import { PVE_COM_USER_NAMES, PVE_UNREGISTERED_NAMES } from "../constant"
import { hasValidQueries, HasValidQueriesArgs } from "../utils/function/hasValidQueries"
import { isCpuLevelValue } from "../utils/game/cpu/utils/isCPULevelValue"
import { reducerPayloadSpecify } from "../utils/game/roomStateReducer"
import { initialState } from "../utils/game/state"
import { redisHandsInit, redisTrashInit } from "./redis/gameProcess"

/**
 * CPU対戦におけるサーバー側の処理
 */
const cpuModeHandler = (io: Socket, socket: any) => {
  console.log('cpuModeHandler')
  const adapterPubClient: Redis = socket.adapter.pubClient

  socket.on('emit', async (payload: EmitForPVE) => {
    console.log(payload, 'payload')
    console.log(socket.id, 'socket.id')
    const { event, gameId } = payload
    const payloadQuery = payload.query
    console.log(event, 'event')
    console.log(payloadQuery, 'payloadQuery')

    switch (event) {
      /**
       * ゲーム開始時の処理
       * nextGameでgame.idが切り替わる時もここから処理が行われる
       */
      case 'prepare': {
        const hasValidQueriesArgs: HasValidQueriesArgs = {
          query: payloadQuery,
          target: [{ key: 'pveKey', forceString: true }]
        }
        if (!hasValidQueries(hasValidQueriesArgs)) return {} // queryを検証
        if (typeof gameId !== 'number') return {} // gameIdを検証

        const { query } = hasValidQueriesArgs
        const isFirstGame = gameId === 1

        const deckKey = `pve:${query.pveKey}:deck`
        await adapterPubClient.sunionstore(deckKey, 'deck') // Redis copy deck for pve
        const yourName = typeof query?.me === 'string' ? query.me : PVE_UNREGISTERED_NAMES // Using nickname if you LoggedIn
        const users = [yourName, ...PVE_COM_USER_NAMES]
        const userData:Player[] = []
        let myHands:Board['hands'] = []
        const otherHands: Board['otherHands'] = []

        for (let i = 0; i < users.length; i += 1) {
          const isCom = PVE_COM_USER_NAMES.includes(users[i])
          const mode = isCom ? query?.[users[i]] : undefined

          // Hands initialize
          const nameKey = isCom ? users[i] : 'me'
          const userHandsKey = `pve:${query.pveKey}:user:${nameKey}:hands`
          const hands = await redisHandsInit(adapterPubClient, deckKey, userHandsKey)
          isCom ? otherHands.push({ userId: 0, hands }) : myHands = hands

          // Score update
          let score = 0
          const userKey = `pve:${query.pveKey}:user:${nameKey}`
          if (isFirstGame) {
            adapterPubClient.hset(userKey, 'score', score)
          } else {
            const latestScore = await adapterPubClient.hget(userKey, 'score') // eslint-disable-line no-await-in-loop
            if (latestScore) {
              score = Number(latestScore)
            }
          }

          userData.push({ id: 0, nickname: users[i], turn: i + 1, score, isWinner: false, isLoser: false, mode: (typeof mode === 'string' && isCpuLevelValue(mode)) ? mode : undefined })
        }

        // Trash initialize
        const trashKey = `pve:${query.pveKey}:trash`
        const initialTrash = await redisTrashInit(adapterPubClient, deckKey, trashKey)
        const deckCount = await adapterPubClient.scard(deckKey)

        const reducerPayload: reducerPayloadSpecify = {
          game: {
            board: {
              users: userData,
              hands: myHands,
              otherHands,
              turn: 1,
              deckCount,
              trash: {
                card: initialTrash,
                user: initialState.game.board.trash.user,
              },
              effect: initialState.game.board.effect,
              bonusCards: initialState.game.board.bonusCards,
            },
            status: 'playing',
            result: initialState.game.result,
          }
        }
        socket.emit('updateStateSpecify', reducerPayload) // 送信者を更新
        break
      }
      default: return {}
    }
    return {}
  })
}

export { cpuModeHandler }