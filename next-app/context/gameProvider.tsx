import React, { createContext, Dispatch, FC, ReactNode, useState } from "react"
import { Game } from "../@types/game"
import { SocketClient } from "../utils/socket/client"

export type GameProviderState = {
  roomId: number | null
  userId: number | null
  game: Game
  connected: boolean
  wsClient: SocketClient | null
}

export type GameProviderDispatch = Dispatch<GameProviderState> | undefined

const gameInitialState: GameProviderState = {
  roomId: null,
  userId: null,
  game: {
    id: null,
    setCount: null,
    status: undefined,
    event: {
      user: { nickname:'', turn:0 },
      action: null,
      message: null
    },
    board: {
      users: [],
      deckCount: 0,
      hands: [],
      trash: {
        card: '',
        user: {
          id: 0,
          nickname: '',
          turn: 0,
          score: 0,
          isWinner: false,
          isLoser: false
        }
      },
      otherHands: [],
      turn: null,
      effect: [],
      allowDobon: true,
      bonusCards: []
    },
    result: {},
  },
  connected: false,
  wsClient: null
}

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