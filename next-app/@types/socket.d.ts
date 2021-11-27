import { Card } from './card'
import { Action, Order, Board } from './game'
import { LiteralUnion } from 'type-fest'

type Event = LiteralUnion<
  | 'drawcard'
  | 'playcard'
  | 'call'
  | 'chat'
  | 'join'
  | 'gamestart'
  | 'gameend'
  | 'gethand'
  | 'getparticipants'
  | 'getusers'
  | 'turnchange',
  string
> | null

export type EmitCard = {
  type: 'card'
  data: Required<Card>
}

export type EmitAction = {
  type: 'action'
  data: Action | Order | OwnerAction
}

export type EmitChat = {
  type: 'chat'
  message: string
}

export type EmitBoard = {
  type: 'board'
  data: Board
}

export type Emit = {
  roomId: number
  gameId?: number | null
  userId?: number
  nickname?: string
  event: Event
  data?: EmitCard | EmitAction | EmitChat | EmitBoard
}

export type HandleEmitFn = (data: Emit) => void // eslint-disable-line no-unused-vars
