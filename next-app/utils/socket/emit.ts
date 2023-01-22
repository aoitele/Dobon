import { Emit, EmitForPVE } from "../../@types/socket"
import { GameProviderState } from "../../context/GameProvider"

const handleEmit = async (wsClient:GameProviderState['wsClient'], data: Emit | EmitForPVE) => {
  if (wsClient?._socket !== null ) {
    const pveKey = localStorage.getItem('pveKey')
    if (pveKey) {
      const query = data.query ? { ...data.query, pveKey } : { pveKey }
      data = { ...data, query }
    }
    await wsClient?.emit(data)
  }
}

export { handleEmit }