/**
 * board状態の更新時のHooks
 */
import { useContext, useEffect } from 'react'
import { BoardStateContext, BoardDispathContext } from '../../../../context/BoardProvider'
import { GameDispathContext } from '../../../../context/GameProvider'

const useBoardCycles = () => {
  const [boardState, gameDispatch, boardDispatch] = [useContext(BoardStateContext), useContext(GameDispathContext), useContext(BoardDispathContext)]

  useEffect(() => {
    if (!gameDispatch || !boardDispatch) return

    const boardStateHandler = () => {
      // Console.log('boardStateHandler called')
    }
    boardStateHandler()
  },[boardState])
}

export { useBoardCycles }