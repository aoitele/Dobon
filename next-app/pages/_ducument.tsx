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
     return {
       ...initialProps,
     }
   }
 
   static render() {
     return (
      <Html lang="ja">
        <Head>
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
     )
   }
 }
 