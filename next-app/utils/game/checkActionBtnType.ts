import { BoardProviderState } from "../../context/BoardProvider"
import { GameProviderState } from "../../context/GameProvider"

export interface ActionBtnTypeArg {
  gameState: GameProviderState
  boardState: BoardProviderState
  type: 'action' | 'dobon'
}

type BtnType = 'dobon' | 'turnChange' | 'draw' | 'deckSet' | 'disabled' // 表示するボタンパターン

export interface ActionBtnTypeResponse {
  type: BtnType
  text: string
}

const TYPE_DOBON      : ActionBtnTypeResponse = { type: 'dobon',      text: 'どぼん！'}
const TYPE_TURNCHANGE : ActionBtnTypeResponse = { type: 'turnChange', text: 'スキップ'}
const TYPE_DRAW       : ActionBtnTypeResponse = { type: 'draw',       text: 'ドロー'}
const TYPE_DECKSET    : ActionBtnTypeResponse = { type: 'deckSet',    text: 'デッキセット＆ドロー'}
const TYPE_DISABLED   : ActionBtnTypeResponse = { type: 'disabled',   text: ''}

const checkActionBtnType = (arg: ActionBtnTypeArg): ActionBtnTypeResponse => {
  const { gameState, boardState, type } = arg


  switch (type) {
    case 'action': {
      if (!boardState.isMyTurn) return {...TYPE_DISABLED, text: 'ドロー'}
      if (boardState.isDrawnCard) return TYPE_TURNCHANGE
      return gameState.game.board.deckCount === 0 ? TYPE_DECKSET : TYPE_DRAW
    }
    case 'dobon': {
      if (!gameState.game.board.allowDobon) return TYPE_DISABLED
      return TYPE_DOBON
    }
    default: return TYPE_DISABLED
  }
}

export { checkActionBtnType }