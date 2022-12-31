import React, { FC } from "react"
import HtmlHead from "../../components/foundations/HtmlHead"
import PveContent from "../../components/pages/pve"
import { WsProvider } from "../../context/wsProvider"

const PvePage:FC = () => {
  return (
    <>
      <HtmlHead title='vsCom' />
      <WsProvider>
        <PveContent />
      </WsProvider>
    </>
  )
}

export default PvePage