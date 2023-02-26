import { Dispatch, SetStateAction } from "react"
import { BoardProviderState } from "../../../../context/BoardProvider"
import { GameProviderState } from "../../../../context/GameProvider"
import { useUpdateStateFn } from "../../../../utils/game/state"
import { handleEmit } from "../../../../utils/socket/emit"

/* eslint-disable no-unused-vars, no-useless-constructor, no-empty-function */
class GameAction {
  constructor(
    private wsClient: GameProviderState['wsClient'],
    private gameState: GameProviderState,
    private gameDispatch: Dispatch<SetStateAction<GameProviderState>>,
    private boardDispatch: Dispatch<SetStateAction<BoardProviderState>>,
  ){}
  async draw() {
    await handleEmit(this.wsClient, { event: 'draw', data: { board: { data: this.gameState.game.board } } })
    this.boardDispatch(prevState => ({ ...prevState, isDrawnCard:true }))
  }
  deckSet() {
    handleEmit(this.wsClient, { event: 'drawcard__deckset', data: { board: { data: this.gameState.game.board } } })
    this.boardDispatch(prevState => ({ ...prevState, isDrawnCard:true }))
  }
  turnChange() {
    const turnChangingState = useUpdateStateFn(this.gameState, { game: { board: { status: 'turnChanging' } } })
    this.gameDispatch({ ...turnChangingState })
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
  }
  notDobon() {
    const turnChangingState = useUpdateStateFn(this.gameState, { game: { board: { allowDobon: false, status: 'turnChanging' } } })
    this.gameDispatch({ ...turnChangingState })
    this.gameDispatch(prevState => ({ ...prevState, game:{...prevState.game, board: {...prevState.game.board, waitDobon: false}} }))
  }
}
/* eslint-enable no-unused-vars, no-useless-constructor, no-empty-function */

export { GameAction }