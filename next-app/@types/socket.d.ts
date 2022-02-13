import { Card } from './card'
import { Action, Order, Board, Player, Effect } from './game'
import { LiteralUnion } from 'type-fest'
import { NestedPartial } from '../@types/utility'

type Event =
  | 'drawcard'
  | 'drawcard__duetoeffect'
  | 'drawcard__deckset'
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
  | 'draw'
  | 'turnchange'
  | 'dobon'
  | 'dobonsuccess'
  | 'dobonfailure'
  | 'action'
  | 'effect'
  | 'effectcard'
  | 'effectupdate'
  | 'avoidEffect'
  | 'notAvoidEffect'
  | Effect
  | null

export type ModalEvent = Pick<Event,'dobon' ,'dobonsuccess' , 'dobonfailure', 'avoidEffect', 'notAvoidEffect', 'skip', 'draw', 'draw2', 'draw4', 'draw6', 'draw8', 'wild', 'reverse', 'opencard'>

export type EmitCard = {
  type: 'card'
  data: Required<Card>
}

export type EmitAction = {
  type: 'action'
  data: {
    effectState: Effect[]
    effect: Effect
  }
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
  data?: EmitCard | EmitAction | EmitBoard
}

export type HandleEmitFn = (data: Emit) => Promise<any> // eslint-disable-line no-unused-vars
