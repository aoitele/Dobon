import { resSocketClient, SocketClient } from "../../../../utils/socket/client"

interface EstablishWsForPveResponse {
  client: SocketClient | null
}

const response: EstablishWsForPveResponse = {
  client: null
}

const establishWsForPve = async() => {
  const wsClient = await resSocketClient()

  if (!wsClient) {
    console.log('wsClient is null')
    return response
  }

  await wsClient.connect()

  if (wsClient._socket) {
    wsClient._socket.on('close', () => {
      wsClient._reset()
      console.log('Socket is closed.')
    })
    response.client = wsClient
    /*
     * WsClient._socket.on('updateStateSpecify', (data) => {
     * })
     */
  } 
  return response
}

export { establishWsForPve }