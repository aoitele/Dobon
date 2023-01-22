import { Dispatch, SetStateAction } from "react"
import { InitialBoardState } from "../../../../@types/game"
import { GameProviderState } from "../../../../context/GameProvider"

class GameAction {
  _state: InitialBoardState | null
  _dispatch: Dispatch<SetStateAction<GameProviderState>>

  constructor(dispatch: Dispatch<SetStateAction<GameProviderState>>) {
    this._state = null
    this._dispatch = dispatch
  }
  draw() {
    console.log('draw')
  }
  deckSet() {
    console.log('deckSet')
  }
  skip() {
    console.log('skip')
  }
  dobon() {
    console.log('dobon')
  }
}

export { GameAction }