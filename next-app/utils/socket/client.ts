import { Dispatch } from 'react'
import { io, Socket } from 'socket.io-client';
import { reducerPayload, Action } from '../game/roomStateReducer'

class SocketClient {
    socket: Socket;

    dispatch: Dispatch<Action>;

    constructor(roomName: string) {
        this.socket = io(`${process.env.NEXT_PUBLIC_SERVER_SOCKETIO_ALLOW_ORIGIN}?room=${roomName}`);
        this.dispatch = () => {} // eslint-disable-line
    }

    updateState(state: reducerPayload) {
        const {game} = state;
        this.dispatch({type:'updateGameState', payload:{ game }})
    }
}
const resSocketClient = async(roomName: string): Promise<SocketClient | null> => {
    console.log('-----establish start------')
    const sc = await new SocketClient(roomName)
    sc.socket.on('hello', (message) => console.log(`hello:${message}`))
    sc.socket.on('message', (message) => console.log(`message:${message}`))
    sc.socket.on('updateState', (state: reducerPayload) => sc.updateState(state))
    return sc
}

export { SocketClient, resSocketClient }