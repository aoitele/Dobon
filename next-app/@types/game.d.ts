import { Event, ModalEvent } from './socket'
import { HandCards, Card } from './card'
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
    | 'showScore'
    | 'loading'
    | 'connection loss'
    | undefined
  event: ModalEffect
  board: Board
  result: GameResult
}
export type GameStatus = Game['status']

export type Player = {
  id: number
  nickname: string
  image?: string
  turn: number
  score: number
  isWinner: boolean
  isLoser: boolean
}
export type OtherHands = {
  userId: number
  hands: string[] | HandCards[]
}

export type Board = {
  users: Player[]
  deckCount: number
  hands: string[] | HandCards[]
  trash: {
    card: string | HandCards
    user: Player
  }
  otherHands: OtherHands[]
  turn: number | null
  effect: Effect[] // カードの効果名
  bonusCards: string[]
  allowDobon: boolean
}

export type InitialBoardState = {
  selectedCard: string
  selectedWildCard: {
    isSelected: boolean
    suit: Card['suit']
  }
  isMyTurn: boolean
  isMyTurnConsecutive: boolean // 連続して自分のターンかどうか(skip使用時にtrueとなる)
  isNextUserTurn: boolean
  isDrawnCard: boolean
  actionBtnStyle: 'disabled' | 'active' | 'action' | 'skip' | 'draw'
  dobonBtnStyle: 'disabled' | 'active' | 'dobon'
  isBtnActive: {
    action: boolean
    dobon: boolean
  },
  showAvoidEffectview: boolean
  loading: boolean // putOut中など処理実行中の場合にtrueとなるフラグ。UI抑制に利用。
}

export interface GameResult {
  dobonHandsCount?: number // ドボン発生時にドボン手札のカード枚数が入る
}

export type Action = 'avoidEffect' | 'notAvoidEffect'
export type Order = 'skip' | 'draw'| 'draw2'| 'draw4'| 'draw6'| 'draw8' | 'wild' | 'reverse' | 'opencard' | 'dobon' | 'dobonsuccess' | 'dobonfailure' | null

export type AllActionType = Action | Order
export type ModalEffect = {
  user: Pick<Player, 'nickname' | 'turn'>
  action: Event
  message: string  | null
}
export type Effect = 'joker' | 'draw2'| 'draw4'| 'draw6'| 'draw8' | 'skip' | 'wild' |'wildspade' | 'wildheart' | 'wildclub' | 'wilddia' | 'reverse' | 'opencard'
export type WildEffect = Extract<'wildspade' | 'wildheart' | 'wildclub' | 'wilddia', Effect>
export type SolvableEffects = Effect[]
export type AddableEffects = Exclude<Effect, 'skip' | 'wild'>[] // Board.effectsに入れられる効果

export type CPULevel = 'easy' | 'normal' | 'hard'