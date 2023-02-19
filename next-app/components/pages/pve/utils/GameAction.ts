import { Dispatch, SetStateAction } from "react"
import { BoardProviderState } from "../../../../context/BoardProvider"
import { GameProviderState } from "../../../../context/GameProvider"
import { handleEmit } from "../../../../utils/socket/emit"

/* eslint-disable no-unused-vars, no-useless-constructor, no-empty-function */
class GameAction {
  constructor(
    private wsClient: GameProviderState['wsClient'],
    private gameState: GameProviderState,
    private gameDispatch: Dispatch<SetStateAction<GameProviderState>>,
    private boardDispatch: Dispatch<SetStateAction<BoardProviderState>>,
  ){}
  draw() {
    handleEmit(this.wsClient, { event: 'draw', data: { board: { data: this.gameState.game.board } } })
    this.boardDispatch(prevState => ({ ...prevState, isDrawnCard:true }))
  }
  deckSet() {
    handleEmit(this.wsClient, { event: 'drawcard__deckset', data: { board: { data: this.gameState.game.board } } })
    this.boardDispatch(prevState => ({ ...prevState, isDrawnCard:true }))
  }
  turnChange() {
    console.log('turnChange')
    handleEmit(
      this.wsClient, {
        event: 'turnchange',
        data: { board: { data: this.gameState.game.board, option:{ values: {}, triggered: 'actionBtn' } } }
      }
    )
    this.boardDispatch(prevState => ({ ...prevState, isMyTurn: false }))
  }
  dobon() {
    handleEmit(
      this.wsClient, {
        event: 'dobon',
        user: this.gameState.game.board.users[0],
        data: { board: { data: this.gameState.game.board } }
      }
    )
    this.gameDispatch(prevState => prevState)
  }
}
/* eslint-enable no-unused-vars, no-useless-constructor, no-empty-function */

export { GameAction }