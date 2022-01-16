import { Event } from './socket'
import { HandCards } from './card'
import { GameUserInfo } from './user'

export type Room = {
  id: number
  title: string
  status: number
  max_seat: number
  set_count: number
  rate: number
  invitation_code: string
  create_user_id: number | null
  created: Date
  modified: Date
}

export type Game = {
  id: number | null
  status:
    | 'join'
    | 'created'
    | 'playing'
    | 'ended'
    | 'loading'
    | 'connection loss'
    | undefined
  event: Event
  board: Board
}
export type GameStatus = Game['status']

export type Player = {
  id: number
  nickname: string
  image?: string
  turn: number
  score: number
}
export type OtherHands = {
  userId: number
  hands: string[] | HandCards[]
}

export type Board = {
  users: Player[]
  deck: string[]
  hands: string[] | HandCards[]
  trash: string[] | HandCards[]
  otherHands: OtherHands[]
  turn: number | null
  effect: { type: Order; value: number | null } | null
}

export type OwnerAction = { participants: GameUserInfo[] }
export type Action = 'avoidEffect' | 'notAvoidEffect'
export type Order = 'skip' | 'draw'| 'draw2'| 'draw4'| 'draw6'| 'draw8' | 'wild' | 'reverse' | 'opencard' | 'dobon' | null

export type AllActionType = Action | Order
export type ModalEffect = {
  user: Player
  action: AllActionType
  message: string
}