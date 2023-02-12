import { Dispatch, SetStateAction } from "react";
import { BoardProviderState, boardProviderInitialState } from "../../../../context/BoardProvider";
import { GameProviderState } from "../../../../context/GameProvider";
import { resetMyHandsStatus, updateMyHandsStatus } from "../../../../utils/game/checkHand";
import { EmitForPVE } from "../../../../@types/socket";
import { handleEmit } from "../../../../utils/socket/emit"

/* eslint-disable no-unused-vars, no-useless-constructor, no-empty-function */
class Effect {
  constructor(
    private wsClient: GameProviderState['wsClient'],
    private gameState: GameProviderState,
    private boardState: BoardProviderState,
    private gameDispatch: Dispatch<SetStateAction<GameProviderState>>,
    private boardDispatch: Dispatch<SetStateAction<BoardProviderState>>,
  ){}
  async accept() {
    const isDrawEvent = this.gameState.game.board.effect.find(ef => ef.match(/draw/u))
    const isOpenCardEvent = this.gameState.game.board.effect.find(ef => ef.match(/opencard/u))
    if (!isDrawEvent && !isOpenCardEvent) return

    const actionEmit:EmitForPVE = {
      event: isDrawEvent ? 'drawcard__effect' : 'opencard',
      data: {
        board : { data: { hands: this.gameState.game.board.hands }},
        action: { data: { effectState: this.gameState.game.board.effect, effect: isDrawEvent ?? 'opencard' }}
      }
    }
    await handleEmit(this.wsClient, actionEmit)
    this.boardDispatch({ ...this.boardState, showAvoidEffectview: false })
  }
  get description() {
    switch(this.gameState.game.board.effect[0]) {
      case 'draw2'    : return 'カードを2枚引きます'
      case 'draw4'    : return 'カードを4枚引きます'
      case 'draw6'    : return 'カードを6枚引きます'
      case 'draw8'    : return 'カードを8枚引きます'
      case 'opencard' : return '手札を公開します'
      default         : return ''
    }
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

export { Effect }