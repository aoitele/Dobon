import { Emit, EmitForPVE } from "../../@types/socket"
// Import sleep from "../game/sleep"

const handleEmit = async (wsClient:any, data: Emit | EmitForPVE) => {
  if (wsClient?._socket !== null ) {
    await wsClient?.emit(data)
    // Await sleep(500) // State更新処理を待たせるため0.5秒のsleepを噛ませる
  }
}

export { handleEmit }