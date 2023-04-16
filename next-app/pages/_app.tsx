import React from 'react'
import '../styles/globals.css'
import '../styles/scss/foundation/reset.scss'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../context/AuthProvider'
import dynamic from 'next/dynamic'
import { GameProvider } from '../context/GameProvider'
import { BoardProvider } from '../context/BoardProvider'
import { ScoreProvider } from '../context/ScoreProvider'
import { useRouteChangeEvent } from '../hooks/useRouteChangeEvent'

const ErrorPage = dynamic(() => import('./_error'))

const MyApp = ({ Component, pageProps }: AppProps) => {
  if (pageProps.error) return <ErrorPage />

  useRouteChangeEvent()
  
  return (
    <AuthProvider>
      <GameProvider>
        <BoardProvider>
          <ScoreProvider>
            <Component {...pageProps} />
          </ScoreProvider>
        </BoardProvider>
      </GameProvider>
    </AuthProvider>
  )
}
export default MyApp
