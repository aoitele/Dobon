import React from 'react'
import '../styles/globals.css'
import '../styles/scss/foundation/reset.scss'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../context/authProvider'
import dynamic from 'next/dynamic'
import { GameProvider } from '../context/gameProvider'

const ErrorPage = dynamic(() => import('./_error'))

const MyApp = ({ Component, pageProps }: AppProps) => {
  if (pageProps.error) return <ErrorPage />

  return (
    <AuthProvider>
      <GameProvider>
        <Component {...pageProps} />
      </GameProvider>
    </AuthProvider>
  )
}
export default MyApp
