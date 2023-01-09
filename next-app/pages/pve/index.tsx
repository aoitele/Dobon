import React, { FC, useContext } from "react"
import HtmlHead from "../../components/foundations/HtmlHead"
import { Board } from "../../components/pages/pve/components/Board"
import { useGameCycles } from "../../components/pages/pve/hooks/useGameCycles"
import { BoardProvider } from "../../context/boardProver"
import { GameStateContext } from "../../context/gameProvider"

const PvePage:FC = () => {  
  const gameState = useContext(GameStateContext)
  useGameCycles()

  return (
    <>
      <HtmlHead title='vsCom' />
      <BoardProvider>
        {gameState.game.status === 'playing' && <Board />}
      </BoardProvider>
    </>
  )
}

export default PvePage