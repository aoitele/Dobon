import React from 'react'
import Head from 'next/head'
import DobonConst from '../../constant'

interface Props {
  title: string
}
const HtmlHead: React.FC<Props> = ({ title }) => (
  <>
    <Head>
      <title>{title} | {DobonConst.SITE_NAME}</title>
      <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover' />
    </Head>
  </>
)
export default HtmlHead
