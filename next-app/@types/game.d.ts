import { Event } from './socket'
import { HandCards } from './card'

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
  hands: HandCards[]
}

export type Board = {
  users: Player[]
  deck: string[]
  hands: string[] | HandCards[]
  trash: string[]
  otherHands: OtherHands[]
}

export type Action = 'avoidEffect' | 'notAvoidEffect'
export type Order = 'skip' | 'draw' | 'wild' | 'elevenback' | 'opencard' | null
