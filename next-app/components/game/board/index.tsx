import React from 'react'
import { GameSet } from '../GameSet'
import { UserInfo } from '../UserInfo'
import { SingleCard } from '../SingleCard'
import CardWithCount from '../CardWithCount'
import CardEffect from '../CardEffect'
import ChatBoard from '../ChatBoard'

const board = (room: any, handleEmit: any) => {
  const posts = [
    { nickname: '一郎', message: 'おはようございます' },
    { nickname: '二郎', message: 'こんにちは' },
    { nickname: '三郎', message: 'こんばんは' },
    { nickname: '四郎', message: 'おはこんばんちは' }
  ]
  return (
    <>
      <GameSet gameSet={1} setCount={10} />
      <UserInfo nickname={'taro'} score={200} />
      <SingleCard suit="c" num={1} isOpen={true} />
      <SingleCard suit="c" num={2} isOpen={false} />
      <SingleCard suit="x" num={0} isOpen={true} />
      <SingleCard isOpen={false} />
      <svg width="24px" height="24px" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z"
        />
      </svg>
      <CardWithCount
        card={[
          {
            suit: 'd',
            num: 1,
            isOpen: false
          },
          {
            suit: 'h',
            num: 2,
            isOpen: false
          },
          {
            suit: 's',
            num: 4,
            isOpen: false
          }
        ]}
        numStyle="right"
      />
      <CardWithCount
        card={[
          {
            suit: 'd',
            num: 3,
            isOpen: false
          },
          {
            suit: 'x',
            num: 1,
            isOpen: false
          },
          {
            suit: 'c',
            num: 1,
            isOpen: true
          },
          {
            suit: 'd',
            num: 1,
            isOpen: true
          }
        ]}
        numStyle="bottom"
      />
      <CardEffect order={'draw'} value={2} />
      <CardEffect order={'opencard'} value={13} />
      {room.id && (
        <ChatBoard
          roomId={room.id}
          posts={posts}
          handleEmit={handleEmit}
        />
      )}
    </>
  )
}
export default board