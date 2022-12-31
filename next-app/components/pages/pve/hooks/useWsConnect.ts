import { useContext } from "react"
import { WebSocketDispathContext } from "../../../../context/wsProvider"
import { resSocketClient } from "../../../../utils/socket/client"

const establishWsForPve = async() => {
  const dispatch = useContext(WebSocketDispathContext)
  const wsClient = await resSocketClient()
  if (!wsClient || typeof dispatch === 'undefined') return

  await wsClient.connect()

  if (wsClient._socket) {
    wsClient._socket.on('close', () => {
      wsClient._reset()
      console.log('Socket is closed.')
    })
    /*
     * WsClient._socket.on('updateStateSpecify', (data) => {
     * })
     */
    dispatch({ client:wsClient })
  }
}

export { establishWsForPve }