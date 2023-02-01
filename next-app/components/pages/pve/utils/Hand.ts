import { EmitBoard } from "../../../../@types/socket";
import { GameProviderState } from "../../../../context/GameProvider";
import { handleEmit } from "../../../../utils/socket/emit"

/* eslint-disable no-unused-vars, no-useless-constructor, no-empty-function */
class Hand {
  constructor(
    private wsClient: GameProviderState['wsClient'],
    private gameState: GameProviderState,
    // Private gameDispatch: Dispatch<SetStateAction<GameProviderState>>,
    // Private boardDispatch: Dispatch<SetStateAction<BoardProviderState>>,
  ){}
  putOut(trash: string) {
    console.log('putOut')
    const boardState:EmitBoard['data'] = {...this.gameState.game.board, trash: { card: `${trash}o`, user: this.gameState.game.board.users[0] }}
    handleEmit(
      this.wsClient, {
        event: 'playcard',
        data: { type: 'board', data: boardState }
      }
    ).then(() => {
      handleEmit(
        this.wsClient, {
          event: 'turnchange',
          data: { type: 'board', data: boardState }
        }
      )
    })
  }
}
/* eslint-enable no-unused-vars, no-useless-constructor, no-empty-function */

export { Hand }