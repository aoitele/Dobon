import React, { FC, useContext } from "react"
import HtmlHead from "../../components/foundations/HtmlHead"
import PveContent from "../../components/pages/pve"
import { establishWsForPve } from "../../components/pages/pve/hooks/useWsConnect"
import { WebSocketStateContext } from "../../context/wsProvider"

const PvePage:FC = () => {
  const values = useContext(WebSocketStateContext)
  if (!values.client) {
    establishWsForPve()
  }

  return (
    <>
      <HtmlHead title='vsCom' />
      {values.client && <PveContent />}
    </>
  )
}

export default PvePage