import React, { createContext, Dispatch, FC, ReactNode, useState } from "react"
import { SocketClient } from "../utils/socket/client"

interface WSProviderState {
  client: SocketClient | null
}
export type WSProviderStateDispatch = Dispatch<WSProviderState> | undefined

const initialState: WSProviderState = {
  client: null
}

/**
 * Create Context
 */
const WebSocketStateContext = createContext<WSProviderState>({ client: null })
const WebSocketDispathContext = createContext<WSProviderStateDispatch>(undefined)

interface Props {
  children: ReactNode
}
const WsProvider:FC<Props> = (props) => {
  const [values, dispatch] = useState(initialState)

  return (
    <WebSocketDispathContext.Provider value={dispatch}>
      <WebSocketStateContext.Provider value={values}>
        {props.children}
      </WebSocketStateContext.Provider>
    </WebSocketDispathContext.Provider>
  )
}

export { WsProvider, WebSocketStateContext, WebSocketDispathContext }