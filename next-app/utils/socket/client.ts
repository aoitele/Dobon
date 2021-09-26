import { Dispatch } from 'react'
import { io, Socket } from 'socket.io-client';
import { reducerPayload, Action } from '../game/roomStateReducer'

class SocketClient {
    socket: Socket;

    dispatch: Dispatch<Action>;

    constructor(roomId: string) {
        this.socket = io(`${process.env.NEXT_PUBLIC_SERVER_SOCKETIO_ALLOW_ORIGIN}?roomId=${roomId}`);
        this.dispatch = () => {} // eslint-disable-line
    }

    updateState(state: reducerPayload) {
        const { roomId, game} = state;
        this.dispatch({type:'updateGameState', payload:{ roomId, game }})
    }

    response(data: reducerPayload) {
        console.log(this, 'data')
        return data
    }
}
const resSocketClient = async(roomId: string): Promise<SocketClient | null> => {
    const sc = await new SocketClient(roomId)
    sc.socket.on('updateState', (state: reducerPayload) => sc.updateState(state))
    sc.socket.on('response', (data: reducerPayload) => sc.response(data))
    return sc
}

export { SocketClient, resSocketClient }