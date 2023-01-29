import { Card } from './card'
import { Action, Order, Board, Player, Effect, InitialBoardState } from './game'
import { LiteralUnion } from 'type-fest'
import { NestedPartial, PartiallyPartial } from '../@types/utility'
import { ParsedUrlQuery } from 'querystring'

export type Event =
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
  | 'dobonreverse'
  | 'getbonus'
  | 'postprocess'
  | 'action'
  | 'effect'
  | 'effectcard'
  | 'effectupdate'
  | 'avoidEffect'
  | 'notAvoidEffect'
  | 'cpuTurn'
  | Effect
  | null

export type ModalEvent = Pick<Event,'dobon' ,'dobonsuccess' , 'dobonfailure', 'dobonreverse', 'avoidEffect', 'notAvoidEffect', 'skip', 'draw', 'draw2', 'draw4', 'draw6', 'draw8', 'wild', 'reverse', 'opencard'>

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
  option?: {
    values: Partial<InitialBoardState>
    triggered: 'putOut' | 'actionBtn' | undefined
  }
}

export type EmitDataType = EmitCard['type'] | EmitAction['type'] | EmitBoard['type']

export type Emit = {
  roomId: number
  gameId?: number | null
  userId?: number
  user?: Player
  nickname?: string
  event: Event
  data?: EmitCard | EmitAction | EmitBoard
  query?: ParsedUrlQuery
}

export type EmitForPVE = PartiallyPartial<Emit, 'roomId'>

export type HandleEmitFn = (data: Emit) => Promise<any> // eslint-disable-line no-unused-vars
