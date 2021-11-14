import { Card } from './card'
import { Action, Order } from './game'
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
  | 'getusers',
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

export type Emit = {
  roomId: number
  gameId?: number | null
  userId?: number
  nickname?: string
  event: Event
  data?: EmitCard | EmitAction | EmitChat
}

export type HandleEmitFn = (data: Emit) => void // eslint-disable-line no-unused-vars
