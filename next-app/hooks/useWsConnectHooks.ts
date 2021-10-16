import { useEffect, Dispatch } from 'react'
import { NextRouter } from 'next/router'
import { gameInitialState, Action } from '../utils/game/roomStateReducer'
import hasProperty from '../utils/function/hasProperty'
import { resSocketClient } from '../utils/socket/client'
import { useUpdateStateFn } from "../utils/game/state";
import nookies from 'nookies'

const useWsConnectHooks = (router:NextRouter, state: gameInitialState, dispatch: Dispatch<Action>) => {

    useEffect(() => {
        if (typeof window !== 'undefined') {  
            const establishWS = async() => {
                if (!router.isReady || !hasProperty(state, 'connected')) return;
                const roomId = router.query.id
            
                if (!state.connected && roomId) {
                    const rid = typeof roomId === 'string' ? roomId : roomId[0] // 同じクエリパラメータから取得する値が複数あると配列が返るため
                    const wsClient = await resSocketClient(rid)
                    if (wsClient) {
                        wsClient.socket.on('close', () => {
                            console.log('Socket is closed.')
                        })
                        wsClient.socket.on('updateStateSpecify', data => {
                            const newState = useUpdateStateFn(state, data)
                            dispatch({ type:'updateStateSpecify', payload: newState})
                        })
                        wsClient.socket.on('createToken', token => {
                            nookies.set(null, 'accesstoken', token, {
                                maxAge: 24 * 60 * 60, // 1day
                                path: '/',
                              })
                        })
                        dispatch({ type:'wsClientSet', payload:{ connected: true, wsClient, roomId: Number(rid) }})
                    }
                }
            }
            establishWS()
        }
    },[router.isReady])
}

export default useWsConnectHooks