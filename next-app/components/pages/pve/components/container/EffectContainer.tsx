import React, { useContext } from "react"
import { BoardStateContext } from "../../../../../context/BoardProvider"
import { GameStateContext } from "../../../../../context/GameProvider"
import { isModalEvent } from "../../../../../utils/game/event"
import { createMsg } from "../../../../../utils/game/message"
import EffectAnimation from "../../../../game/EffectAnimation"
import AvoidEffectSelecter from "../modules/AvoidEffectSelecter"

const EffectContainer = () => {
  const [boardState, gameState] = [useContext(BoardStateContext), useContext(GameStateContext)]

  return (
    <>
      { gameState.game.event.user && isModalEvent(gameState.game.event.action) &&
        <EffectAnimation
          user={gameState.game.event.user}
          action={gameState.game.event.action}
          message={createMsg({action: gameState.game.event.action, card: gameState.game.board.trash.card})}
        />
      }
      { boardState.showAvoidEffectview && <AvoidEffectSelecter /> }
    </>
  )
}

export { EffectContainer }