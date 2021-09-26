import React, { useEffect, useReducer } from 'react'
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { GameSet } from '../../components/game/GameSet'
import { UserInfo } from '../../components/game/UserInfo'
import { SingleCard } from '../../components/game/SingleCard'
import CardWithCount from '../../components/game/CardWithCount'
import CardEffect from '../../components/game/CardEffect'
import ChatBoard from '../../components/game/ChatBoard'
import { resSocketClient } from '../../utils/socket/client'
import { Emit, HandleEmitFn } from '../../@types/socket'
import Modal from '../../components/game/Modal';
import { reducer, gameInitialState } from '../../utils/game/roomStateReducer'
import useEventHooks from '../../hooks/useEventHooks'
import axiosInstance from '../../utils/api/axiosInstance'
import { RoomAPIResponse } from '../../@types/api/roomAPI';

interface Props {
    room: RoomAPIResponse.RoomInfo
}

const initialState: gameInitialState = {
    roomId: null,
    userId: null,
    game: {
        id: null,
        status: 'created',
        event: null,
        board: {
            users:[],
            deck:[],
            hands:[],
            trash:[]
        }
    },
    connected: false,
    wsClient: null,
}

const Room:React.FC<Props> = ({ room }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const router = useRouter()
    const { user } = room
    console.log(user,'user')

    const posts = [
        {nickname: '一郎', message: 'おはようございます'},
        {nickname: '二郎', message: 'こんにちは'},
        {nickname: '三郎', message: 'こんばんは'},
        {nickname: '四郎', message: 'おはこんばんちは'},
    ]
    
    const handleEmit: HandleEmitFn = (data: Emit) => {
        if (state.wsClient && state.wsClient !== null) {
            state.wsClient.socket.emit('emit', data)
        }
    }

    const establishWS = async() => {
        if (!router.isReady) return;
        const roomId = router.query.id
       
        if (!state.connected && roomId) {
            const rid = typeof roomId === 'string' ? roomId : roomId[0] // 同じクエリパラメータから取得する値が複数あると配列が返るため
            const wsClient = await resSocketClient(rid)
            if (wsClient) {
                dispatch({ type:'wsClientSet', payload:{ connected: true, wsClient, roomId: Number(rid) }})
                wsClient.dispatch = dispatch
                wsClient.socket.on('close', () => {
                    console.log('Socket is closed.')
                })
            }
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {   
            const init = async() => {
                await establishWS()
            }
            init()
        }
    }, [router.isReady])
    
    useEventHooks(state, handleEmit)

    if (state.game?.status !== 'playing') {
        return state.roomId
        ? <Modal roomId={state.roomId} status={state.game?.status} handleEmit={handleEmit} />
        : <Modal status='loading' handleEmit={handleEmit} />
    }

     
    return (
    <>
        <GameSet gameSet={1} setCount={10} />
        <UserInfo nickname={'taro'} score={200} />
        <SingleCard suit='c' num={1} isOpen={true} />
        <SingleCard suit='c' num={2} isOpen={false} />
        <SingleCard suit='x' num={0} isOpen={true} />
        <SingleCard isOpen={false} />
        <svg width="24px" height="24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z" />
        </svg>
        <CardWithCount card={[
            {
                suit:'d',
                num: 1,
                isOpen: false
            },
            {
                suit:'h',
                num: 2,
                isOpen: false
            },
            {
                suit:'s',
                num: 4,
                isOpen: false
            }
        ]}
        numStyle='right' 
        />
        <CardWithCount card={[
            {
                suit:'d',
                num: 3,
                isOpen: false
            },
            {
                suit:'x',
                num: 1,
                isOpen: false
            },
            {
                suit:'c',
                num: 1,
                isOpen: true
            },
            {
                suit:'d',
                num: 1,
                isOpen: true
            }
        ]}
        numStyle='bottom'
        />
        <CardEffect
        order={'draw'}
        value={2}
        />
        <CardEffect
        order={'opencard'}
        value={13}
        />
        { state.roomId && <ChatBoard roomId={state.roomId} posts={posts} handleEmit={handleEmit}/> }
    </>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx)=> {
    if (ctx.params) {
        const axios = axiosInstance();
        const url = `/api/room/${ctx.params.id}`
        try {
            const res = await axios.get(url)
            const { room } = res.data
            return room ? { props: { room } } : { props: {} }
        }
        catch(e) {
            console.log(e, 'error')
            return { props: {} }
        }
    }
    return { props: {} }
}

export default Room