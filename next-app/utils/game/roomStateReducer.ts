import { Game } from '../../@types/game'
import { SocketClient } from '../socket/client'

export interface gameInitialState {
    game?: Game;
    connected: boolean;
    wsClient: SocketClient | null;
}

export interface gameStateReducerAction {
    type: 'set';
    payload: gameInitialState;
}

export const reducer = (state: gameInitialState, action: gameStateReducerAction) => {
    const {connected, wsClient} = action.payload;

    switch (action.type) {
        case 'set': return {...state, connected, wsClient}
        default:
            throw new Error();
    }
}