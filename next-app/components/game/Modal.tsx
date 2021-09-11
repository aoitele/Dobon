import React from 'react'
import style from './Modal.module.scss'
import { GameStatus } from '../../@types/game'
import { HandleEmitFn } from '../../@types/socket'

interface Props {
    room: string;
    status: GameStatus;
    handleEmit: HandleEmitFn;
}
const modal:React.FC<Props> = ({ room, status, handleEmit }) => (
        <>
          <div className={`${style.modalWrap} ${style.modalOpen}`}>
                <div className={style.modalInner}>
                    { modalInner(room, status, handleEmit) }
                </div>
            </div>
            <div className={style.modalBack}/>
        </>
    )

const modalInner = (room: string, status: GameStatus, handleEmit: HandleEmitFn) => {
    switch(status) {
        case 'created': return (
            <div>
                <p className={style.statusText}>ゲーム開始前です</p>

                <div className={style.info}>
                    <p>ドボンしようぜ</p>
                    <ul>
                        <li>レート：x1</li>
                        <li>参加枠：4</li>
                    </ul>                    
                </div>
                <div className={style.info}>
                    <p>
                        現在の参加者
                        <span className={style.waiting}>受付中！</span>
                    </p>
                    <ul>
                        <li>たろう</li>
                        <li>じろう</li>
                        <li>さぶろう</li>
                    </ul>
                </div>
                <a href="#" className={style.startBtn} onClick={() => handleEmit({room, event: 'gamestart'})}>ゲームスタート</a>
            </div>  
        )
        case 'loading': return (
            <div className={style.modalBack}>
                <div className={style.loader}>
                    <p>ロード中...</p>
                </div>
            </div>
        )
        case 'ended': return (
            <div className={style.modalBack}>
                <div className={style.modalInner}>
                    <p>ゲームが終了しました</p>
                </div>
            </div>
        )
        case 'connection loss': return (
            <div className={style.modalBack}>
                <div className={style.modalInner}>
                    <p>通信できませんでした</p>
                </div>
            </div>
        )
        default: return <></>
    }
}

export default modal