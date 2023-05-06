import React, { useContext } from 'react'
import { BoardStateContext } from '../../../../../context/BoardProvider'
import { GameStateContext } from '../../../../../context/GameProvider'
import { isEffectCard } from '../../../../../utils/game/effect'
import SelectCardInfo from '../../../../game/SelectCardInfo'
import UserInfo from '../../../../game/UserInfo'
import styles from './MyInfoContainer.module.scss'

/**
 * selectingCardが効果カードのとき、UserInfoの領域はカード効果のヒントを表示させている
 */
const MyInfoContainer = () => {
  const [gameState, boardState] = [useContext(GameStateContext), useContext(BoardStateContext)]
  const turnUser = gameState.game.board.users.find(user => user.turn === gameState.game.board.turn)
  const isSelectingEffectCard = isEffectCard({ card:[boardState.selectedCard], isMyCard:true })

  return (
    <div className={styles.wrap}>
      {isSelectingEffectCard
      ? <SelectCardInfo states={{values: boardState}}/>
      : turnUser && <UserInfo user={gameState.game.board.users[0]} turnUser={turnUser} />}
    </div>
  )
}

export { MyInfoContainer }