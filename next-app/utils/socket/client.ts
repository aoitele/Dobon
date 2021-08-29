import { io, Socket } from 'socket.io-client';

class SocketClient {
    socket: Socket;

    constructor(roomName: string) {
        this.socket = io(`${process.env.NEXT_PUBLIC_SERVER_SOCKETIO_ALLOW_ORIGIN}?room=${roomName}`);
    }
}
const resSocketClient = async(roomName: string): Promise<SocketClient | null> => {
    console.log('-----establish start------')
    const sc = await new SocketClient(roomName)
    return sc
}

export { SocketClient, resSocketClient }