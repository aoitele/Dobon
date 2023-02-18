import React, { createContext, Dispatch, FC, ReactNode, SetStateAction, useState } from "react"
import { Game } from "../@types/game"
import { SocketClient } from "../utils/socket/client"
import { gameInitialState } from "./state/gameInitialState"

export type GameProviderState = {
  roomId: number | null
  userId: number | null
  game: Game
  connected: boolean
  wsClient: SocketClient | null
}

export type GameProviderDispatch = Dispatch<SetStateAction<GameProviderState>> | undefined

/**
 * Create Context
 */
const GameStateContext = createContext<GameProviderState>(gameInitialState)
const GameDispathContext = createContext<GameProviderDispatch>(undefined)

interface Props {
  children: ReactNode
}

const GameProvider:FC<Props> = (props) => {
  const [values, dispatch] = useState(gameInitialState)

  return (
    <GameStateContext.Provider value={values}>
      <GameDispathContext.Provider value={dispatch}>
        {props.children}
      </GameDispathContext.Provider>
    </GameStateContext.Provider>
  )
}

export { GameProvider, GameStateContext, GameDispathContext }