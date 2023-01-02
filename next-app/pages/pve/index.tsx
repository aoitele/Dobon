import { NextRouter, useRouter } from "next/router"
import React, { FC, useContext, useEffect, useState } from "react"
import { EmitForPVE } from "../../@types/socket"
import HtmlHead from "../../components/foundations/HtmlHead"
import PveContent from "../../components/pages/pve"
import { establishWsForPve } from "../../components/pages/pve/hooks/useWsConnect"
import { WebSocketDispathContext, WebSocketStateContext, WSProviderState } from "../../context/wsProvider"
import { handleEmit } from "../../utils/socket/emit"

const initialState = {
  isReady: false
}

const PvePage:FC = () => {
  const [values, setValues] = useState(initialState)
  const wsState = useContext(WebSocketStateContext)
  const dispatch = useContext(WebSocketDispathContext)
  const router = useRouter()

  useEffect(() => {
    if (!wsState.client && !values.isReady) {
      establishWsForPve().then(res => {
        if (res.client && dispatch) {
          prepare(res.client, router.query)
          dispatch({ client: res.client })
          setValues({ isReady:true })
        }
      })
    }
  }, [])

  return (
    <>
      <HtmlHead title='vsCom' />
      {wsState.client && values.isReady && <PveContent />}
    </>
  )
}

const prepare = (wsClient: WSProviderState['client'], query: NextRouter['query']) => {
  if (!wsClient) return
  const data: EmitForPVE = { event: 'prepare', query }
  handleEmit(wsClient, data)
}

export default PvePage