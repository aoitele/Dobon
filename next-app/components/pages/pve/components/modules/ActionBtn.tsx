import React, { FC, useContext } from 'react'
import { InitialBoardState } from '../../../../../@types/game'
import { BoardStateContext } from '../../../../../context/BoardProvider'
import { GameDispathContext, GameProviderState, GameStateContext } from '../../../../../context/GameProvider'
import { GameAction } from '../../utils/gameAction'
import styles from './ActionBtn.module.scss'

type BtnType = 'action' | 'dobon'

interface Props {
  type: BtnType
}

interface BtnStateProps {
  gameState: GameProviderState
  boardState: InitialBoardState
  type: BtnType
}

const ActionBtn: FC<Props> = ({ type }) => {
  const gameState = useContext(GameStateContext)
  const boardState = useContext(BoardStateContext)
  const dispatch = useContext(GameDispathContext)
  if (!dispatch) return <></>

  const action = new GameAction(dispatch)
  console.log(action, 'action')

  const props: BtnStateProps = { gameState, boardState, type }

  return (
    <div className={styles[btnStyle(props)]}>{btnText(props)}</div>
  )
}

const btnText = ({ gameState, boardState, type }: BtnStateProps) => {
  if (type === 'dobon') return 'どぼん！'

  // アクションボタンは盤面や自分のアクション状態によりテキストを変化
  return boardState.isDrawnCard
    ? 'スキップ'
    : gameState.game.board.deckCount === 0
      ? 'デッキセット＆ドロー'
      : 'ドロー'
}

const btnStyle = ({ gameState, boardState, type }: BtnStateProps) => {
  if (!boardState.isMyTurn) return 'disabled'

  const isGameStartPhase = gameState.game.board.trash.user.turn === 0 // ゲーム開始時
  const lastTrashUserIsMe = gameState.game.board.trash.user.id === 0 // Me?.id

  switch (type) {
    case 'action': {
      if (boardState.isDrawnCard) return 'skip'
      return boardState.isBtnActive.action ? 'active' : 'draw'
    }
    case 'dobon': {
      if (!gameState.game.board.allowDobon) return 'disabled'
      if (isGameStartPhase || lastTrashUserIsMe) return 'dobon'
      break;
    }
    default: return 'disabled'
  }
  return 'disabled'
}

export default ActionBtn