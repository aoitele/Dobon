import React from 'react'
import Head from 'next/head'

interface Props {
  title: string
}
const HtmlHead: React.FC<Props> = ({ title }) => (
  <>
    <Head>
      <title>{title}</title>
      <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover' />
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
    </Head>
  </>
)
export default HtmlHead
