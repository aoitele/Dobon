import { Dispatch, SetStateAction } from "react"
import { GameProviderState } from "../../../../context/GameProvider"
import { useUpdateStateFn } from "../../../../utils/game/state"
import { resSocketClient, SocketClient } from "../../../../utils/socket/client"

interface Props {
  dispatch: Dispatch<SetStateAction<GameProviderState>>
}

interface EstablishWsForPveResponse {
  client: SocketClient | null
}

const establishWsForPve = async({ dispatch }: Props) => {
  const response: EstablishWsForPveResponse = { client: null }
  const wsClient = await resSocketClient()

  if (!wsClient) {
    console.log('wsClient is null')
    return response
  }

  await wsClient.connect({ pveKey: localStorage.getItem('pveKey') ?? undefined })

  if (wsClient._socket) {
    wsClient._socket.on('close', () => {
      wsClient._reset()
      console.log('Socket is closed.')
    })

    wsClient._socket.on('updateStateSpecify', (data) => {
      dispatch(prevState => ({ ...useUpdateStateFn(prevState, data) }))
    })
    response.client = wsClient
  }
  return response
}

export { establishWsForPve }