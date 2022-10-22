import React, { VFC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import style from './index.module.scss'

const ErrorPageContent:VFC = () => {
  return (
    <div className={style.wrap}>
      <div className={style.content}>
        <h1 className={style.heading}>404 Not Found</h1>
        <p>ページが見つかりませんでした。</p>
        <Image
          src='/images/numa_hamaru_woman.png'
          width={140}
          height={140}
        />
        <div className={style.link__active}>
          <Link href="/">TOPに戻る</Link>
        </div>
      </div>
    </div>
  )
}

export default ErrorPageContent