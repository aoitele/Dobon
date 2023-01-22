import React, { createContext, Dispatch, FC, ReactNode, SetStateAction, useState } from "react"
import { Card } from "../@types/card"
import { InitialBoardState } from "../@types/game"

export type BoardProviderState = {
  selectedCard: string
  selectedWildCard: {
    isSelected: boolean
    suit: Card['suit']
  }
  isMyTurn: boolean
  isMyTurnConsecutive: boolean // 連続して自分のターンかどうか(skip使用時にtrueとなる)
  isNextUserTurn: boolean
  isDrawnCard: boolean
  actionBtnStyle: 'disabled' | 'active' | 'action' | 'skip' | 'draw'
  dobonBtnStyle: 'disabled' | 'active' | 'dobon'
  isBtnActive: {
    action: boolean
    dobon: boolean
  },
  showAvoidEffectview: boolean
  loading: boolean // putOut中など処理実行中の場合にtrueとなるフラグ。UI抑制に利用。
}

export type BoardProviderDispatch = Dispatch<SetStateAction<BoardProviderState>> | undefined

const initialState: BoardProviderState = {
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
const BoardStateContext = createContext<BoardProviderState>(initialState)
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