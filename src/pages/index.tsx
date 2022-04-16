import { NextPage } from 'next/types'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Home | Blockin Demo</title>
        <meta name="description" content="Demo dApp for Blockin library" />
      </Head>
      <section className='home'>
        <h2>Your wallet is connected</h2>
        <h3>View each demo page below</h3>
        <ul>
          <li>
            <Link href={'/scenarios/verification'}>
              <a>Verification</a>
            </Link>
          </li>
          <li>
            <Link href={'/scenarios/user-creates'}>
              <a>User Creates</a>
            </Link>
          </li>
          <li>
            <Link href={'/scenarios/resource-creates'}>
              <a>Resource Creates</a>
            </Link>
          </li>
        </ul>
      </section>
    </Layout>
  )
}

export default Home
