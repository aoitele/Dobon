import React, { createContext, Dispatch, FC, ReactNode, SetStateAction, useState } from "react"

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
  winerScore: number
  loserScore: number
  message: string
}

export type ScoreProviderDispatch = Dispatch<SetStateAction<ScoreProviderState>> | undefined

const ScoreProviderInitialState: ScoreProviderState = {
  bonusCards: [],
  bonusTotal: 0,
  addBonus: {
    isSingleDobon: false,
    isReverseDobon: false,
    jokerCount: 0
  },
  resultScore: 0,
  roundUpScore: 0,
  winerScore: 0,
  loserScore: 0,
  message: '',
}

/**
 * Create Context
 */
const ScoreStateContext = createContext<ScoreProviderState>(ScoreProviderInitialState)
const ScoreDispathContext = createContext<ScoreProviderDispatch>(undefined)

interface Props {
  children: ReactNode
}

const ScoreProvider:FC<Props> = (props) => {
  const [values, dispatch] = useState(ScoreProviderInitialState)

  return (
    <ScoreStateContext.Provider value={values}>
      <ScoreDispathContext.Provider value={dispatch}>
        {props.children}
      </ScoreDispathContext.Provider>
    </ScoreStateContext.Provider>
  )
}

export { ScoreProvider, ScoreStateContext, ScoreDispathContext, ScoreProviderInitialState }