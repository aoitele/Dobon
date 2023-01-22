import { Dispatch, SetStateAction } from "react"
import { InitialBoardState } from "../../../../@types/game"
import { GameProviderState } from "../../../../context/GameProvider"
import { handleEmit } from "../../../../utils/socket/emit"

class GameAction {
  _wsClient: GameProviderState['wsClient']
  _state: InitialBoardState | null
  _dispatch: Dispatch<SetStateAction<GameProviderState>>

  constructor(wsClient: GameProviderState['wsClient'], dispatch: Dispatch<SetStateAction<GameProviderState>>) {
    this._wsClient = wsClient
    this._state = null
    this._dispatch = dispatch
  }
  draw() {
    console.log('draw')
    handleEmit(this._wsClient, { event:'draw' })
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