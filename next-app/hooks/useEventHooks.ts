import { useEffect } from 'react'
import { HandleEmitFn, Emit } from '../@types/socket'
import { gameInitialState } from '../utils/game/roomStateReducer'

const useEventHooks = (state: gameInitialState, handleEmit: HandleEmitFn) => {
    const { roomId, game } = state

    useEffect(() => {
        if(!state || !game?.event) {
            return
        }

        const handler = () => {        
            switch(game.event) {
                case 'join': {
                    console.log('join')
                    break;
                }
                case 'gamestart': {
                    console.log('ゲームを開始します')
                    // Get users hands
                    if (game.status === 'playing' && roomId) {   
                        const data:Emit = {
                            roomId,
                            gameId: game.id || null,
                            userId: 1,
                            event: 'gethand',
                        }
                        const hands = handleEmit(data)
                        console.log(hands, 'hands')
                    }
                    break;   
                }
                case 'gethand': {
                    console.log('gethand HookS!')
                    break;
                }
                default: break;
            }
        }
        handler()
    },[game?.event])
}

export default useEventHooks