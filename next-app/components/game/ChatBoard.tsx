import React, { useState } from "react";
import style from './ChatBoard.module.scss'
import { Emit, HandleEmitFn } from '../../@types/socket'

interface Props {
    user: string;
    post: string;
    handleEmit: HandleEmitFn;
}

const chatBoard:React.FC<Props> = ({ user, post, handleEmit }) => {
    const [inputNewPost] = useState(false)
    const [message, setMessage] = useState('')

    const submit = () => {
        const data:Emit = {
            roomId: 1,
            userId: 1,
            nickname: 'taro',
            event: 'chat',
            data: { message }
        }
        handleEmit(data)
    }
    return (
        <div className={style.wrap} >
            <div className={style.post}>
                <p className={style.message}>{user}：{post}</p>
                <p className={style.message}>ユーザー１：コメント</p>
                <p className={style.message}>ユーザー１：コメント</p>
                <p className={style.message}>ユーザー１：コメント</p>
                <div className={style.message}>
                    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="post message..." style={{ backgroundColor : inputNewPost ? "white" : "black", color: "white", width: "75%", fontSize: "16px" }} />
                    <a href="#" className={style.submitBtn} onClick={submit}>send</a>
                </div>
            </div>
            <div>
            </div>
        </div>
    )    
}

export default chatBoard