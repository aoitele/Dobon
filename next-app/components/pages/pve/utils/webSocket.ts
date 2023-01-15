import { Dispatch } from "react"
import { GameProviderState } from "../../../../context/GameProvider"
import { gameInitialState } from "../../../../utils/game/roomStateReducer"
import { useUpdateStateFn } from "../../../../utils/game/state"
import { resSocketClient, SocketClient } from "../../../../utils/socket/client"

interface Props {
  state: gameInitialState
  dispatch: Dispatch<GameProviderState>
}

interface EstablishWsForPveResponse {
  client: SocketClient | null
}

const establishWsForPve = async({state, dispatch}: Props) => {
  const response: EstablishWsForPveResponse = { client: null }
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

    wsClient._socket.on('updateStateSpecify', (data) => {
      const newState = useUpdateStateFn(state, data)
      if (newState) {
        dispatch({...newState})
      }
    })
    response.client = wsClient
  }
  return response
}

export { establishWsForPve }