import React, { useContext } from "react"
import { GameDispathContext, GameStateContext } from "../../../../../context/GameProvider"
import { useUpdateStateFn } from "../../../../../utils/game/state"
import styles from './GameSpeed.module.scss'

const GameSpeed = () => {
  const [gameState, gameDispatch] = [useContext(GameStateContext), useContext(GameDispathContext)]
  const speed = gameState.game.board.speed

  const changeSpeed = () => {
    const newState = useUpdateStateFn(gameState, {game: {board: {speed: speed === '1x' ? '2x' : '1x'}}})
    gameDispatch?.({...newState})    
  }

  if (!speed) return <></>

  return (
    <div className={styles.wrap} onClick={changeSpeed}>
      <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" style={{width:"20px", height:"20px", opacity:"0.8"}} viewBox="0 0 512 512"><path d="M256 0C114.625 0 0 114.625 0 256c0 141.374 114.625 256 256 256 141.374 0 256-114.626 256-256C512 114.625 397.374 0 256 0zm95.062 258.898-144 85.945a3.323 3.323 0 0 1-3.406.031 3.379 3.379 0 0 1-1.687-2.937V170.045c0-1.218.656-2.343 1.687-2.938a3.403 3.403 0 0 1 3.406.031l144 85.962c1.031.586 1.641 1.718 1.641 2.89 0 1.197-.609 2.307-1.641 2.908z" style={{fill:"#FF4500"}}/></svg>
      <span className={styles.speedText}>{speed}</span>
    </div>
  )
}

export default GameSpeed