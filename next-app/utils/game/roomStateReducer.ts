import { Game } from '../../@types/game'
import { SocketClient } from '../socket/client'

export interface gameInitialState {
    game?: Game;
    connected: boolean;
    wsClient: SocketClient | null;
}

export type reducerPayload = Partial<gameInitialState>;

export interface wsClientSet {
    type: 'wsClientSet';
    payload: gameInitialState;
}

export interface updateGameState {
    type: 'updateGameState';
    payload: reducerPayload;
}

export type Action = wsClientSet | updateGameState;

export const reducer = (state: reducerPayload, action: Action) => {
    const {connected, wsClient, game} = action.payload;

    switch (action.type) {
        case 'wsClientSet': return {...state, connected, wsClient}
        case 'updateGameState': return {...state, game}
        default:
            throw new Error();
    }
}