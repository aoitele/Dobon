import { Emit, EmitForPVE } from "../../@types/socket"

const handleEmit = async (wsClient:any, data: Emit | EmitForPVE) => {
  if (wsClient?._socket !== null ) {
    await wsClient?.emit(data)
  }
}

export { handleEmit }