import React, { createContext, Dispatch, FC, ReactNode, SetStateAction, useState } from "react"
import { Player } from "../@types/game"

export interface ScoreProviderState {
  bonusCards: string[]
  bonusTotal: number
  addBonus: {
    isSingleDobon: boolean
    isReverseDobon: boolean
    jokerCount: number
  }
  resultScore: number
  roundUpScore: number
  winner: Player[] | null
  loser: Player[] | null
  message: string
}

export type ScoreProviderDispatch = Dispatch<SetStateAction<ScoreProviderState>> | undefined

const scoreProviderInitialState: ScoreProviderState = {
  bonusCards: [],
  bonusTotal: 0,
  addBonus: {
    isSingleDobon: false,
    isReverseDobon: false,
    jokerCount: 0
  },
  resultScore: 0,
  roundUpScore: 0,
  winner: null,
  loser: null,
  message: '',
}

/**
 * Create Context
 */
const ScoreStateContext = createContext<ScoreProviderState>(scoreProviderInitialState)
const ScoreDispathContext = createContext<ScoreProviderDispatch>(undefined)

interface Props {
  children: ReactNode
}

const ScoreProvider:FC<Props> = (props) => {
  const [values, dispatch] = useState(scoreProviderInitialState)

  return (
    <ScoreStateContext.Provider value={values}>
      <ScoreDispathContext.Provider value={dispatch}>
        {props.children}
      </ScoreDispathContext.Provider>
    </ScoreStateContext.Provider>
  )
}

export { ScoreProvider, ScoreStateContext, ScoreDispathContext, scoreProviderInitialState }