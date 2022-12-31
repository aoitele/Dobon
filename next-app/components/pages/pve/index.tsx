import React, { useContext } from "react"
import { WebSocketStateContext } from "../../../context/wsProvider"
import { establishWsForPve } from "./hooks/useWsConnect"

const PveContent = () => {
  const values = useContext(WebSocketStateContext)

  if (!values.client) {
    establishWsForPve()
  }

  return (
    <>
      {values.client && <div>PveContent</div>}
    </>
  )
}

export default PveContent