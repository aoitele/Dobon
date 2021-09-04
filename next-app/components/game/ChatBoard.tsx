import React, { useState } from "react";
import style from './ChatBoard.module.scss'
import { Emit, HandleEmitFn } from '../../@types/socket'

interface Props {
    room: string;
    posts: {
        nickname: string;
        message: string;
    }[];
    handleEmit: HandleEmitFn;
}

const chatBoard:React.FC<Props> = ({ room, posts, handleEmit }) => {
    const [inputNewPost] = useState(false)
    const [message, setMessage] = useState('')

    const submit = () => {
        const data:Emit = {
            room,
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
                { posts.map((post,idx) => 
                    <p className={style.message} key={idx}>{post.nickname}：{post.message}</p>)
                }
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