import React, { FC, useContext } from "react"
import HtmlHead from "../../components/foundations/HtmlHead"
import ScoreBoard from "../../components/pages/pve/components/modules/ScoreBoard"
import { Board } from "../../components/pages/pve/components/Board"
import { useGameCycles } from "../../components/pages/pve/hooks/useGameCycles"
import { GameStateContext } from "../../context/GameProvider"
import { ResultBoard } from "../../components/pages/pve/components/modules/ResultBoard"

const PvePage:FC = () => {  
  const gameState = useContext(GameStateContext)
  useGameCycles()

  return (
    <>
      <HtmlHead title='vsCom' />
      {gameState.game.status === 'playing' && <Board />}
      {(gameState.game.status === 'ended' || gameState.game.status === 'showScore') && <ScoreBoard />}
      {gameState.game.status === 'gameSet' && <ResultBoard />}
    </>
  )
}

export default PvePage