import { Card } from './card'
import { Action, Order, Board, Player } from './game'
import { LiteralUnion } from 'type-fest'
import { NestedPartial } from '../@types/utility'

type Event = LiteralUnion<
  | 'drawcard'
  | 'playcard'
  | 'call'
  | 'chat'
  | 'join'
  | 'prepare'
  | 'preparecomplete'
  | 'gamestart'
  | 'gameend'
  | 'gethand'
  | 'getparticipants'
  | 'getusers'
  | 'turnchange'
  | 'effect'
  | 'dobon'
  | 'dobonsuccess'
  | 'dobonfailure'
  | 'avoidEffect'
  | 'notAvoidEffect'
  | 'skip'
  | 'draw'
  | 'draw2'
  | 'draw4'
  | 'draw6'
  | 'draw8'
  | 'wild'
  | 'reverse'
  | 'opencard',
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
  data: NestedPartial<Board>
}

export type Emit = {
  roomId: number
  gameId?: number | null
  userId?: number
  user?: Player
  nickname?: string
  event: Event
  data?: EmitCard | EmitAction | EmitChat | EmitBoard
}

export type HandleEmitFn = (data: Emit) => Promise<any> // eslint-disable-line no-unused-vars
