import { useEffect, Dispatch } from 'react'
import { NextRouter } from 'next/router'
import { gameInitialState, Action } from '../utils/game/roomStateReducer'
import hasProperty from '../utils/function/hasProperty'
import { resSocketClient } from '../utils/socket/client'
import { useUpdateStateFn } from '../utils/game/state'

const useWsConnectHooks = (
  router: NextRouter,
  state: gameInitialState,
  dispatch: Dispatch<Action>
) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const establishWS = async () => {
        if (!router.isReady || !hasProperty(state, 'connected')) return
        const roomId = router.query.id

        if (!state.connected && roomId) {
          const wsClient = await resSocketClient()
          if (!wsClient) return
          const rid = typeof roomId === 'string' ? roomId : roomId[0] // 同じクエリパラメータから取得する値が複数あると配列が返るため
          await wsClient.connect(rid)
          if (wsClient._socket) {
            wsClient._socket.on('close', () => {
              wsClient._reset()
              console.log('Socket is closed.')
            })
            wsClient._socket.on('updateStateSpecify', (data) => {
              const newState = useUpdateStateFn(state, data)
              dispatch({ type: 'updateStateSpecify', payload: newState })
            })
            dispatch({
              type: 'wsClientSet',
              payload: { connected: true, wsClient, roomId: Number(rid) }
            })
          }
        }
      }
      establishWS()
    }
  }, [router.isReady])
}

export default useWsConnectHooks
