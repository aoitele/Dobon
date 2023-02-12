import { Dispatch, SetStateAction } from "react";
import { EmitBoard } from "../../../../@types/socket";
import { BoardProviderState, boardProviderInitialState } from "../../../../context/BoardProvider";
import { GameProviderState } from "../../../../context/GameProvider";
import { resetMyHandsStatus, updateMyHandsStatus } from "../../../../utils/game/checkHand";
import { resEffectName } from "../../../../utils/game/effect";
import sleep from "../../../../utils/game/sleep";
import { handleEmit } from "../../../../utils/socket/emit"

/* eslint-disable no-unused-vars, no-useless-constructor, no-empty-function */
class Hand {
  constructor(
    private wsClient: GameProviderState['wsClient'],
    private gameState: GameProviderState,
    private boardState: BoardProviderState,
    private gameDispatch: Dispatch<SetStateAction<GameProviderState>>,
    private boardDispatch: Dispatch<SetStateAction<BoardProviderState>>,
  ){}
  async putOut (trash: string) {
    console.log('putOut')
    const boardState:EmitBoard['data'] = {...this.gameState.game.board, trash: { card: trash, user: this.gameState.game.board.users[0] }}
    const effectName = resEffectName({card:[trash], selectedWildCard: this.boardState.selectedWildCard})

    handleEmit(
      this.wsClient, {
        event: 'playcard',
        user: this.gameState.game.board.users[0],
        data: {
          board: { data: boardState },
          action: effectName
            ? { data: { effectState: this.gameState.game.board.effect, effect: effectName }}
            : undefined
        }
      }
    )
    await sleep(1000)

    handleEmit(
      this.wsClient, {
        event: 'turnchange',
        data: {
          board: {
            data: boardState,
            option: { values: { isMyTurnConsecutive: this.boardState.isMyTurnConsecutive }, triggered: 'putOut' }
          },
        }
      }
    )
    this.resetStatus()
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