import React, { VFC } from 'react'
import HtmlHead from '../components/foundations/HtmlHead'
import ErrorPageContent from '../components/pages/error'

const Error:VFC = () => {
  return (
    <div>
      <HtmlHead title={'Error'}/>
      <ErrorPageContent />
    </div>
  )
}

export default Error