import { Redis } from "ioredis"
import { Socket } from "socket.io-client"
import { Player } from "../@types/game"
import { EmitForPVE } from "../@types/socket"
import { isCpuLevelValue } from "../utils/game/cpu/utils/isCPULevelValue"

/**
 * CPU対戦におけるサーバー側の処理
 */
const cpuModeHandler = (io: Socket, socket: any) => {
  console.log('cpuModeHandler')
  const adapterPubClient: Redis = socket.adapter.pubClient

  socket.on('emit', async (payload: EmitForPVE) => {
    console.log(payload, 'payload')
    console.log(socket.id, 'socket.id')
    const { event, query } = payload
    console.log(event, 'event')
    switch (event) {
      /**
       * ゲーム開始時の処理
       */
      case 'prepare': {
        const deckKey = `pve:${socket.id}:deck`
        await adapterPubClient.sunionstore(deckKey, 'deck') // Redis copy deck for pve
        const comUsers = ['com1', 'com2', 'com3']
        const yourName = typeof query?.me === 'string' ? query.me : 'あなた' // Using nickname if you LoggedIn
        const users = [yourName, ...comUsers]
        const userData:Player[] = []

        for (let i = 0; i < users.length; i += 1) {
          const isCom = comUsers.includes(users[i])
          const mode = isCom ? query?.[users[i]] : undefined
          userData.push({ id: 0, nickname: users[i], turn: 0, score: 0, isWinner: false, isLoser: false, mode: (typeof mode === 'string' && isCpuLevelValue(mode)) ? mode : undefined })
        }
        break
      }
      default: return {}
    }
    return {}
  })
}

export { cpuModeHandler }