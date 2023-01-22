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
    this._dispatch(prevState => prevState)
  }
  deckSet() {
    console.log('deckSet')
    this._dispatch(prevState => prevState)
  }
  skip() {
    console.log('skip')
    this._dispatch(prevState => prevState)
  }
  dobon() {
    console.log('dobon')
    this._dispatch(prevState => prevState)
  }
}

export { GameAction }