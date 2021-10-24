import React from 'react'
import '../styles/globals.css'
import '../styles/scss/foundation/reset.scss'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../context/authProvider'

const MyApp = ({ Component, pageProps }: AppProps) => (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
export default MyApp
