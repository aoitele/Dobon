import React, { useEffect } from 'react'
import Head from 'next/head'
import { SITE_NAME } from '../../constant'
import { initializeReactGa4 } from '../../lib/react_ga4/ga4'

interface Props {
  title: string
}
const HtmlHead: React.FC<Props> = ({ title }) => {

  // サイトアクセス時のみheadでの読み込みが必要な処理を記述する
  useEffect(() => {
    initializeReactGa4()
  }, [])

  return (
    <>
      <Head>
        <title>{title} | {SITE_NAME}</title>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover' />
        {/* Using Font - Rubik */}
        <link href="https://fonts.googleapis.com/css?family=Rubik" rel="stylesheet" />
      </Head>
    </>
  )
}
export default HtmlHead
