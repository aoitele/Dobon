import React from 'react'
import style from './Modal.module.scss'
import { Game } from '../../@types/game'
import { HandleEmitFn } from '../../@types/socket'
import { RoomAPIResponse } from '../../@types/api/roomAPI'
import Link from 'next/link'
import { AuthState } from '../../context/AuthProvider'
import { DOBON_ROOM_STATUS_WAITING } from '../../constant'

interface Props {
  room?: RoomAPIResponse['roomInfo']
  game?: Game
  handleEmit: HandleEmitFn
  loading?: boolean
  authUser?: AuthState['authUser']
}
const modal: React.FC<Props> = ({ room, game, handleEmit, loading, authUser }) => {

  return (
    <>
      <div className={`${style.modalWrap} ${style.modalOpen}`}>
        {modalInner(handleEmit, authUser, game, room, loading)}
      </div>
      <div className={style.modalBack} />
    </>
  )
}

// Prettier-ignore
const modalInner = (handleEmit: HandleEmitFn, authUser: AuthAPIResponse.UserMe | null | undefined, game?:Game, room?: RoomAPIResponse['roomInfo'], loading?:boolean) => { // eslint-disable-line no-unused-vars
  if (loading) {
    return <div className={style.modalBack}><div className={style.loader} /></div>
  }

  if (room && game && authUser) {
    const userId = authUser.id
    const joinedUserIds = game.board.users.map(_ => _.id)
    const userIcon = ['🐰', '🐶', '😾', '🐭']

    const roomInfo = () => {
      return (
        <>
          <div className={style.info}>
            <p>{room.title}</p>
            <ul>
              <li>レート：x{room.rate}</li>
              <li>参加枠：{room.max_seat}</li>
            </ul>
          </div>
          <div className={style.info}>
            <p>現在の参加者</p>
            { 
            game.board.users.length === 0
            ? <div className={style.userFetchAnnounce}>
                <p>ユーザー情報取得中...</p>
              </div>
            : game.board.users.length < room.max_seat
              ? <span className={style.waiting}>参加受付中💓</span>
              : <span className={style.closed}>受付終了🔒</span>
            }
            <ul className={style.userNameUl}>
              { game.board.users.map((user, idx) =>
              <li key={idx}>
                {userIcon[idx]}{user.nickname}{authUser.nickname === user.nickname && '(あなた)'}
              </li>)}
            </ul>
          </div>
        </>
      )
    }
    
    switch (game.status) {
      case 'join':
        return (
          <div className={style.modalInner}>
            { roomInfo() }
            { game.board.users.length < room.max_seat
            ?
              <>
              <div className={style.info}>
                <p>あなた：👤{authUser.nickname}</p>
              </div>
              { !joinedUserIds.includes(userId)
              && room.status === DOBON_ROOM_STATUS_WAITING
              && <a
                  href="#"
                  className={style.startBtn}
                  onClick={() => handleEmit({ roomId:room.id, userId, nickname:authUser.nickname, event: 'join' })}
                >
                  参加する
                </a>
              }
              </>
            : <Link href="/room"><a className={style.startBtn}>ルーム一覧へ戻る</a></Link>  
            }
          </div>
        )
      case 'created': {
        const joinedAbove2User = game.board.users.length > 1
        return (
          <div className={style.modalInner}>
            { roomInfo() }
            <p className={style.statusText} style={{whiteSpace: 'pre-line'}}>
              {
                room.create_user_id === authUser.id
                ? '参加者が揃ったら\nゲームをスタートしてください'
                : 'ゲーム開始前です。\n管理者がゲーム開始するまでお待ちください'
              }
            </p>
            {room && (
              <a
                href="#"
                className={joinedAbove2User ? style.startBtn : style.startBtnDisabled}
                onClick={() =>joinedAbove2User && handleEmit({ roomId: room.id, event: 'prepare' })}
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
  return <></>
}

export default modal
