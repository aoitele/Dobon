import { Player } from "../../../@types/game";

const PLAYER_PVE_ME  : Player = { id:0, nickname: 'me'  , turn: 1, score: 0, isWinner: false, isLoser:false }
const PLAYER_PVE_COM1: Player = { id:0, nickname: 'com1', turn: 2, score: 0, isWinner: false, isLoser:false }
const PLAYER_PVE_COM2: Player = { id:0, nickname: 'com2', turn: 3, score: 0, isWinner: false, isLoser:false }
const PLAYER_PVE_COM3: Player = { id:0, nickname: 'com3', turn: 4, score: 0, isWinner: false, isLoser:false }

const PLAYERS_FOR_PVE = [PLAYER_PVE_ME, PLAYER_PVE_COM1, PLAYER_PVE_COM2, PLAYER_PVE_COM3]


interface SetWinnerParams {
  winnerTurns: number[]
  loserTurns: number[]
}
const setWinner = ({ winnerTurns, loserTurns }: SetWinnerParams) => {
  const users = PLAYERS_FOR_PVE.map(item => {
    item.isWinner = winnerTurns.includes(item.turn)
    item.isLoser  = loserTurns.includes(item.turn)
    return item
  })

  return {
    users,
    winner: users.filter(u => u.isWinner),
    loser: users.filter(u => u.isLoser),
  }
}

export { PLAYERS_FOR_PVE, setWinner }