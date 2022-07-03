import React from 'react'
import HtmlHead from '../components/foundations/HtmlHead'
import Layout from '../components/foundations/layout'
import HowToPageContent from '../components/pages/howto'

const HowToPage = () => {
  return (
  <Layout>
    <HtmlHead title={'How to play'} />
    <HowToPageContent/>
  </Layout>
  )
}

export default HowToPage