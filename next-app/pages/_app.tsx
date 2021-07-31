import React from 'react'
import '../styles/globals.css'
import '../styles/scss/foundation/reset.scss'
import type { AppProps } from 'next/app'

const MyApp = ({ Component, pageProps }: AppProps) => <Component {...pageProps} />
export default MyApp
