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
    console.log('draw')
    handleEmit(this.wsClient, { event: 'draw' })
    this.boardDispatch(prevState => ({ ...prevState, isDrawnCard:true }))
  }
  deckSet() {
    console.log('deckSet')
    this.gameDispatch(prevState => prevState)
  }
  turnChange() {
    console.log('turnChange')
    handleEmit(
      this.wsClient, {
        event: 'turnchange',
        data: { type: 'board', data: this.gameState.game.board, option:{ values: {}, triggered: 'actionBtn' }}
      }
    )
    this.boardDispatch(prevState => ({ ...prevState, isMyTurn: false }))
  }
  dobon() {
    console.log('dobon')
    this.gameDispatch(prevState => prevState)
  }
}
/* eslint-enable no-unused-vars, no-useless-constructor, no-empty-function */

export { GameAction }