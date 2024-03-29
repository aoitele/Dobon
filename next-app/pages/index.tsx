import React from 'react'
import Layout from '../components/foundations/layout'
import HtmlHead from '../components/foundations/HtmlHead'
import TopPageContent from '../components/pages/index'

const IndexPage = () => (
  <Layout>
    <HtmlHead title='ドボン' />
    <TopPageContent/>
  </Layout>
)

export default IndexPage
