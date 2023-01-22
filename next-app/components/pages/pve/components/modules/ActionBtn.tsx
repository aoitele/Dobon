import React, { FC, useContext } from 'react'
import { BoardStateContext } from '../../../../../context/BoardProvider'
import { GameDispathContext, GameStateContext } from '../../../../../context/GameProvider'
import { ActionBtnTypeResponse, checkActionBtnType } from '../../../../../utils/game/checkActionBtnType'
import { GameAction } from '../../utils/gameAction'
import styles from './ActionBtn.module.scss'

type BtnBaseType = 'action' | 'dobon'

interface Props {
  type: BtnBaseType
}

const ActionBtn: FC<Props> = ({ type }) => {
  const [gameState, boardState, gameDispatch] = [useContext(GameStateContext), useContext(BoardStateContext), useContext(GameDispathContext)]

  if (!gameDispatch) return <></>

  const Action = new GameAction(gameDispatch)
  console.log(Action, 'Action')
  const btnType = checkActionBtnType({ gameState, boardState, type })

  return (
    <div
      onClick={() => onClickFnExec(btnType, Action)}
      className={styles[btnType.type]}
    >
      {btnType.text}
    </div>
  )
}

const onClickFnExec = (btnType: ActionBtnTypeResponse, Action: GameAction) => {
  switch(btnType.type) {
    case 'deckSet': return Action.deckSet()
    case 'dobon': return Action.dobon()
    case 'draw': return Action.draw()
    case 'skip': return Action.skip()
    default: return undefined
  }
}

export default ActionBtn