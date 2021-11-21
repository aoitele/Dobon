/**
 **
 * Head, Bodyタグを拡張して共通処理などを組み込む場合にdocument.tsxを使用。
 * SSRのみで実行されるためクライアント側の処理は書かない。
 * <Main />に入るReactコンポーネントはブラウザで初期化されないため、
 * 全コンポーネントで共通する処理は_app.tsxに記述する。
 */
import Document, { DocumentContext, Html, Head, Main, NextScript, DocumentInitialProps } from 'next/document'
import React from 'react'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }
  
  // eslint-disable-next-line
  render() {
    return (
      <Html lang="ja">
        <Head>
          {/* PWA HEAD meta start*/}
          <meta name='application-name' content='Dobon -ultimate trump game-' />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta name='apple-mobile-web-app-status-bar-style' content='default' />
          <meta name='apple-mobile-web-app-title' content='Dobon -ultimate trump game-' />
          <meta name='description' content='Dobon is ultimate trump game' />
          <meta name='format-detection' content='telephone=no' />
          <meta name='mobile-web-app-capable' content='yes' />
          <meta name='theme-color' content='#d7bf1d' />

          <link rel='apple-touch-icon' href='/icons/touch-icon-iphone.png' />
          <link rel='icon' type='image/png' sizes='32x32' href='/icons/favicon-32x32.png' />
          <link rel='icon' type='image/png' sizes='16x16' href='/icons/favicon-16x16.png' />
          <link rel='manifest' href='/manifest.json' />
          <link rel='shortcut icon' href='/favicon.ico' />
          <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500' />
          {/* PWA HEAD meta end */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
     )
   }
 }
 