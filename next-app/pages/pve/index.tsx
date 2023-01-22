import React, { FC, useContext } from "react"
import HtmlHead from "../../components/foundations/HtmlHead"
import { Board } from "../../components/pages/pve/components/Board"
import { useGameCycles } from "../../components/pages/pve/hooks/useGameCycles"
import { GameStateContext } from "../../context/GameProvider"

const PvePage:FC = () => {  
  const gameState = useContext(GameStateContext)
  useGameCycles()

  return (
    <>
      <HtmlHead title='vsCom' />
      {gameState.game.status === 'playing' && <Board />}
    </>
  )
}

export default PvePage