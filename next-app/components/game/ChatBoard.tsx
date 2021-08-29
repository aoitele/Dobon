import React, { useState } from "react";
import style from './ChatBoard.module.scss'

interface Props {
    user: string,
    post:string
}

const chatBoard:React.FC<Props> = ({ user, post }) => {
    const [inputNewPost] = useState(false);

    const submit = () => {
        console.log('submit')
    }
    return (
        <div className={style.wrap} >
            <div className={style.post}>
                <p className={style.message}>{user}：{post}</p>
                <p className={style.message}>ユーザー１：コメント</p>
                <p className={style.message}>ユーザー１：コメント</p>
                <p className={style.message}>ユーザー１：コメント</p>
                <div className={style.message}>
                    <input type="text" placeholder="post message..." style={{ backgroundColor : inputNewPost ? "white" : "black", color: "white", width: "75%", fontSize: "16px" }} />
                    <a href="#" className={style.submitBtn} onClick={submit}>send</a>
                </div>
            </div>
            <div>
            </div>
        </div>
    )    
}

export default chatBoard