import React from 'react'
import Link from 'next/link'

const requireUserRegister: React.FC = () =>   
    <>
      <p>ユーザー登録を行ってください</p>
      <Link href="/user/create">ユーザー登録ページへ</Link>
    </>

export default requireUserRegister