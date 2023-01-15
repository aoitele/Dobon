import React, { createContext, Dispatch, FC, ReactNode, SetStateAction, useState } from "react"
import { InitialBoardState } from "../@types/game"

export type BoardProviderDispatch = Dispatch<SetStateAction<InitialBoardState>> | undefined

const initialState: InitialBoardState = {
  selectedCard: '',
  selectedWildCard: {
    isSelected: false,
    suit: null
  },
  isMyTurn: false,
  isMyTurnConsecutive: false,
  isNextUserTurn: false,
  isDrawnCard: false,
  actionBtnStyle: 'disabled',
  dobonBtnStyle: 'disabled',
  isBtnActive: {
    action: false,
    dobon: false
  },
  showAvoidEffectview: false,
  loading: false
}

/**
 * Create Context
 */
const BoardStateContext = createContext<InitialBoardState>(initialState)
const BoardDispathContext = createContext<BoardProviderDispatch>(undefined)

interface Props {
  children: ReactNode
}

const BoardProvider:FC<Props> = (props) => {
  const [values, dispatch] = useState(initialState)

  return (
    <BoardStateContext.Provider value={values}>
      <BoardDispathContext.Provider value={dispatch}>
        {props.children}
      </BoardDispathContext.Provider>
    </BoardStateContext.Provider>
  )
}

export { BoardProvider, BoardStateContext, BoardDispathContext }