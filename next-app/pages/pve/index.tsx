import React, { FC, useContext } from "react"
import HtmlHead from "../../components/foundations/HtmlHead"
import PveContent from "../../components/pages/pve"
import { useGameCycles } from "../../components/pages/pve/hooks/useGameCycles"
import { GameStateContext } from "../../context/gameProvider"

const PvePage:FC = () => {  
  const gameState = useContext(GameStateContext)
  useGameCycles()

  return (
    <>

      <HtmlHead title='vsCom' />
      {gameState.wsClient && <PveContent />}
      <span>status: {gameState.game.status}</span><br/>
      {gameState.game.board.users.map(user => <span key={user.nickname}>{user.nickname}</span>)}
    </>
  )
}

export default PvePage