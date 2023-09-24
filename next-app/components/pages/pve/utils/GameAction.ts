import { Dispatch, SetStateAction } from "react"
import { boardProviderInitialState, BoardProviderState } from "../../../../context/BoardProvider"
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
    const newHands = this.gameState.game.board.hands.map(hand => hand.replace('p', '')) // 手札のputable状態を外す
    const turnChangingState = useUpdateStateFn(this.gameState, { game: { board: { status: 'turnChanging', hands: newHands } } })
    this.gameDispatch({ ...turnChangingState })
    this.boardDispatch(boardProviderInitialState)
  }
  dobon() {
    handleEmit(
      this.wsClient, {
        event: 'dobon',
        user: this.gameState.game.board.users[0],
        data: { board: { data: this.gameState.game.board } }
      }
    )
    const newGameState = useUpdateStateFn(this.gameState, { game: { board: { status: undefined } } })
    this.gameDispatch({ ...newGameState })
  }
  notDobon() {
    // ゲーム開始時に「どぼんしない」を選択した場合、turnChangingは行わない
    if (!this.gameState.game.board.trash.user.nickname) {
      const turnChangingState = useUpdateStateFn(this.gameState, { game: { board: { allowDobon: false, waitDobon: false } } })
      this.gameDispatch({ ...turnChangingState })
      return
    }

    const turnChangingState = useUpdateStateFn(this.gameState, { game: { board: { allowDobon: true, status: 'turnChanging', waitDobon: false } } })
    this.gameDispatch({ ...turnChangingState })
  }
}
/* eslint-enable no-unused-vars, no-useless-constructor, no-empty-function */

export { GameAction }