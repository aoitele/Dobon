import { Emit, EmitForPVE } from "../../@types/socket"
import { GameProviderState } from "../../context/GameProvider"
import sleep from "../game/sleep"

const handleEmit = async (wsClient:GameProviderState['wsClient'], data: Emit | EmitForPVE) => {
  if (wsClient?._socket !== null ) {
    const pveKey = localStorage.getItem('pveKey')
    if (pveKey) {
      const query = data.query ? { ...data.query, pveKey } : { pveKey }
      data = { ...data, query }
    }
    await wsClient?.emit(data)
    await sleep(200) // State更新処理を待たせるため0.2秒のsleepを噛ませる
  }
}

export { handleEmit }