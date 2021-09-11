import React from 'react'
import style from './Modal.module.scss'
import { GameStatus } from '../../@types/game'

interface Props {
    status: GameStatus;
    stateChangeFn: (arg0: number, arg1: GameStatus) => void // eslint-disable-line no-unused-vars
}
const modal:React.FC<Props> = ({ status, stateChangeFn }) => (
        <>
          <div className={`${style.modalWrap} ${style.modalOpen}`}>
                <div className={style.modalInner}>
                    { modalInner(status, stateChangeFn) }
                </div>
            </div>
            <div className={style.modalBack}/>
        </>
    )

const modalInner = (status: GameStatus, stateChangeFn:Props['stateChangeFn']) => {

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
                <a href="#" className={style.startBtn} onClick={() => stateChangeFn(1, 'playing')}>ゲームスタート</a>
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