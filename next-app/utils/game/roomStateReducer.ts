import { Game } from '../../@types/game'
import { SocketClient } from '../socket/client'
import { PartiallyPartial } from '../../@types/utility'

export interface gameInitialState {
    roomId: number | null;
    userId?: number | null;
    game?: Game;
    connected: boolean;
    wsClient: SocketClient | null;
}

export type reducerPayload = PartiallyPartial<gameInitialState, 'connected' | 'wsClient'>;

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
    const { connected, wsClient, roomId, game} = action.payload;
    console.log(action.payload,'action.payload')

    switch (action.type) {
        case 'wsClientSet': return {...state, connected, wsClient, roomId}
        case 'updateGameState': return {...state, game}
        default:
            throw new Error();
    }
}