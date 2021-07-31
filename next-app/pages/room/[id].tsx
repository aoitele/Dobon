import React from 'react'
import { GameSet } from '../../components/game/GameSet'
import { UserInfo } from '../../components/game/UserInfo'
import { SingleCard } from '../../components/game/SingleCard'

const Room = () => (
    <>
        <GameSet gameSet={1} setCount={10} />
        <UserInfo nickname={'taro'} score={200} />
        <SingleCard suit='c' num={1} open={true} />
        <SingleCard suit='c' num={2} open={false} />
        <SingleCard suit='x' num={0} open={true} />
        <SingleCard open={false} />
        <svg width="24px" height="24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z" />
        </svg>
    </>
    )

export default Room