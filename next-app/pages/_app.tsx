import React from 'react'
import '../styles/globals.css'
import '../styles/scss/foundation/reset.scss'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../context/authProvider'
import HtmlHead from '../components/foundations/HtmlHead'
import dynamic from 'next/dynamic'
import { WsProvider } from '../context/wsProvider'

const ErrorPage = dynamic(() => import('./_error'))

const MyApp = ({ Component, pageProps }: AppProps) => {
  if (pageProps.error) return <ErrorPage />

  return (
    <AuthProvider>
      <HtmlHead title={pageProps.title}/>
      <WsProvider>
        <Component {...pageProps} />
      </WsProvider>
    </AuthProvider>
  )
}
export default MyApp
