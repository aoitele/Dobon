import React, { FC, useContext } from 'react'
import { BoardDispathContext, BoardStateContext } from '../../../../../context/BoardProvider'
import { GameDispathContext, GameStateContext } from '../../../../../context/GameProvider'
import { ActionBtnTypeResponse, checkActionBtnType } from '../../../../../utils/game/checkActionBtnType'
import { GameAction } from '../../utils/gameAction'
import { Hand } from '../../utils/Hand'
import styles from './ActionBtn.module.scss'

type BtnBaseType = 'action' | 'dobon'

interface Props {
  type: BtnBaseType
}

const ActionBtn: FC<Props> = ({ type }) => {
  const [gameState, boardState, gameDispatch, boardDispatch] = [useContext(GameStateContext), useContext(BoardStateContext), useContext(GameDispathContext), useContext(BoardDispathContext)]

  if (!gameDispatch || !boardDispatch) return <></>

  const Action = new GameAction(gameState.wsClient, gameState, gameDispatch, boardDispatch)
  const MyHand = new Hand(gameState.wsClient, gameState, gameDispatch)
  const btnType = checkActionBtnType({ gameState, boardState, type })

  return (
    <div
      onClick={() => onClickFnExec(btnType, Action, MyHand)}
      className={styles[btnType.type]}
    >
      {btnType.text}
    </div>
  )
}

const onClickFnExec = async (btnType: ActionBtnTypeResponse, Action: GameAction, MyHand: Hand) => {
  switch(btnType.type) {
    case 'deckSet'    : return Action.deckSet()
    case 'dobon'      : return Action.dobon()
    case 'draw'       : {
      await Action.draw()
      return MyHand.updateStatus()
    }
    case 'turnChange' : {
      MyHand.resetStatus()
      return Action.turnChange()
    }
    default           : return undefined
  }
}

export default ActionBtn