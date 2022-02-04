import { Event, ModalEvent } from './socket'
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
  event: ModalEffect
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
  deckCount: number
  hands: string[] | HandCards[]
  trash: string[] | HandCards[]
  otherHands: OtherHands[]
  turn: number | null
  effect: Effect[] // カードの効果名
}

export type InitialBoardState = {
  selectedCard: string
  isBtnActive: {
    action: boolean
    dobon: boolean
  }
  isMyTurn: boolean
  isNextUserTurn: boolean
  isDrawnCard: boolean
  actionBtnStyle: 'disabled' | 'active' | 'action' | 'skip' | 'draw'
  dobonBtnStyle: 'disabled' | 'active' | 'dobon'
  isModalActive: boolean
}

export type Action = 'avoidEffect' | 'notAvoidEffect'
export type Order = 'skip' | 'draw'| 'draw2'| 'draw4'| 'draw6'| 'draw8' | 'wild' | 'reverse' | 'opencard' | 'dobon' | 'dobonsuccess' | 'dobonfailure' | null

export type AllActionType = Action | Order
export type ModalEffect = {
  user: Pick<Player, 'nickname' | 'turn'>
  action: Event
  message: string  | null
}
export type Effect = 'draw2'| 'draw4'| 'draw6'| 'draw8' | 'skip' | 'wild' |'wildspade' | 'wildheart' | 'wildclub' | 'wilddia' | 'reverse' | 'opencard'