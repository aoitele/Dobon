import React from 'react'
import HtmlHead from '../../components/foundations/HtmlHead'
import PageContent from '../../components/pages/user/login'

const LoginPage: React.FC = () => {
  return (
    <>
      <HtmlHead title={'ユーザー登録/ログイン'} />
      <PageContent/>
    </>
  )
}
 
export default LoginPage
