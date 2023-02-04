import { Dispatch, SetStateAction } from "react";
import { EmitBoard } from "../../../../@types/socket";
import { BoardProviderState, boardProviderInitialState } from "../../../../context/BoardProvider";
import { GameProviderState } from "../../../../context/GameProvider";
import { resetMyHandsStatus, updateMyHandsStatus } from "../../../../utils/game/checkHand";
import { handleEmit } from "../../../../utils/socket/emit"

/* eslint-disable no-unused-vars, no-useless-constructor, no-empty-function */
class Hand {
  constructor(
    private wsClient: GameProviderState['wsClient'],
    private gameState: GameProviderState,
    private gameDispatch: Dispatch<SetStateAction<GameProviderState>>,
    private boardDispatch: Dispatch<SetStateAction<BoardProviderState>>,
  ){}
  async putOut (trash: string) {
    console.log('putOut')
    const boardState:EmitBoard['data'] = {...this.gameState.game.board, trash: { card: `${trash}o`, user: this.gameState.game.board.users[0] }}
    await handleEmit(
      this.wsClient, {
        event: 'playcard',
        data: { type: 'board', data: boardState }
      }
    )
    handleEmit(
      this.wsClient, {
        event: 'turnchange',
        data: { type: 'board', data: boardState }
      }
    )
  }
  updateStatus() {
    // putable状態をリセットして判定に回す
    const h = this.gameState.game.board.hands.map(hand => hand.replace('p', ''))
    const newState = updateMyHandsStatus({ state: this.gameState, hands: h, trash: this.gameState.game.board.trash })
    newState && this.gameDispatch(newState)
  }
  resetStatus() {
    const h = this.gameState.game.board.hands.map(hand => hand.replace('p', ''))
    const newState = resetMyHandsStatus({ state: this.gameState, hands: h })
    newState && this.gameDispatch(newState)
    this.boardDispatch(boardProviderInitialState)
  }
}
/* eslint-enable no-unused-vars, no-useless-constructor, no-empty-function */

export { Hand }