import React, { useState } from 'react'
import style from './Modal.module.scss'
import { Game } from '../../@types/game'
import { HandleEmitFn } from '../../@types/socket'
import { RoomAPIResponse } from '../../@types/api/roomAPI'

interface Props {
  room?: RoomAPIResponse.RoomInfo
  gameId?: string
  roomId?: number
  game?: Game
  handleEmit: HandleEmitFn
}
const modal: React.FC<Props> = ({ room, roomId, game, handleEmit }) => {
  const [nickname, setNickname] = useState('')
  return (
    <>
      <div className={`${style.modalWrap} ${style.modalOpen}`}>
        {modalInner(handleEmit, nickname, setNickname, game, roomId, room)}
      </div>
      <div className={style.modalBack} />
    </>
  )
}

// Prettier-ignore
const modalInner = (handleEmit: HandleEmitFn, nickname:string, setNickname: { (value: React.SetStateAction<string>): void; (arg0: string): void }, game?:Game, roomId?: number, room?: RoomAPIResponse.RoomInfo) => { // eslint-disable-line no-unused-vars
  if (!game) {
    return (
      // Loading
      <div className={style.modalBack}>
        <div className={style.loader} />
      </div>
    )
  }

  switch (game.status) {
    case 'join':
      return (
        <div className={style.modalInner}>
          <div className={style.info}>
            <p>{room?.title}</p>
            <ul>
              <li>レート：x{room?.rate}</li>
              <li>参加枠：{room?.max_seat}</li>
            </ul>
          </div>
          <div className={style.info}>
            <p>
              現在の参加者
              <span className={style.waiting}>受付中！</span>
            </p>
            <ul>
              {game.board.users.map((user, idx) => (
                <li key={idx}>{user.nickname}</li>
              ))}
            </ul>
          </div>
          <div className={style.form}>
            <input
              className={style.formInput}
              type="text"
              placeholder="名前を入力"
              onChange={(e) => {
                setNickname(e.target.value)
              }}
            />
          </div>
          {roomId && (
            <a
              href="#"
              className={nickname ? style.startBtn : style.startBtnDisabled}
              onClick={() => handleEmit({ roomId, nickname, event: 'join' })}
            >
              参加する
            </a>
          )}
        </div>
      )
    case 'created': {
      const joinedAbove2User = game.board.users.length > 1

      return (
        <div className={style.modalInner}>
          <p className={style.statusText}>ゲーム開始前です</p>

          <div className={style.info}>
            <p>{room?.title}</p>
            <ul>
              <li>レート：x{room?.rate}</li>
              <li>参加枠：{room?.max_seat}</li>
            </ul>
          </div>
          <div className={style.info}>
            <p>
              現在の参加者
              <span className={style.waiting}>受付中！</span>
            </p>
            <ul>
              {game.board.users.map((user, idx) => (
                <li key={idx}>{user.nickname}</li>
              ))}
            </ul>
          </div>
          {roomId && (
            <a
              href="#"
              className={
                joinedAbove2User ? style.startBtn : style.startBtnDisabled
              }
              onClick={() =>
                joinedAbove2User && handleEmit({ roomId, event: 'gamestart' })
              }
            >
              ゲームスタート
            </a>
          )}
        </div>
      )
    }
    case 'ended':
      return (
        <div className={style.modalInner}>
          <div className={style.modalBack}>
            <div className={style.modalInner}>
              <p>ゲームが終了しました</p>
            </div>
          </div>
        </div>
      )
    case 'connection loss':
      return (
        <div className={style.modalBack}>
          <div className={style.modalInner}>
            <p>通信できませんでした</p>
          </div>
        </div>
      )
    default:
      return <></>
  }
}

export default modal
