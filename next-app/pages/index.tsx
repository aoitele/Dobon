import React from 'react'
import Link from 'next/link'
import Layout from '../components/foundations/layout';
import HtmlHead from '../components/foundations/HtmlHead';

const IndexPage = () => (
    <Layout>
      <HtmlHead title={'Dobon Game'} />
      <Link href="/room">go to room</Link>
    </Layout>
  )

export default IndexPage
