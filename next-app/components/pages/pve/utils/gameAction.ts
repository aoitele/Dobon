import { Dispatch, SetStateAction } from "react"
import { BoardProviderState } from "../../../../context/BoardProvider"
import { GameProviderState } from "../../../../context/GameProvider"
import { handleEmit } from "../../../../utils/socket/emit"

/* eslint-disable no-unused-vars, no-useless-constructor, no-empty-function */
class GameAction {
  constructor(
    private wsClient: GameProviderState['wsClient'],
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
    handleEmit(this.wsClient, { event: 'turnchange' })
    this.gameDispatch(prevState => prevState)
  }
  dobon() {
    console.log('dobon')
    this.gameDispatch(prevState => prevState)
  }
}
/* eslint-enable no-unused-vars, no-useless-constructor, no-empty-function */

export { GameAction }