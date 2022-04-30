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
                <h3>Explore the links below</h3>
                <ul>
                    <li>
                        <Link href={'/scenarios/verification'}>
                            <a>Demo Walkthrough</a>
                        </Link>
                    </li>
                    <li>
                        <Link href={'https://github.com/matt-davison/blockin'}>
                            <a>GitHub - Blockin Library</a>
                        </Link>
                    </li>

                    <li>
                        <Link href={'https://github.com/kking935/Blockin-Demo'}>
                            <a>GitHub - Demo Site</a>
                        </Link>
                    </li>
                    <li>
                        <Link href={''}>
                            <a>Paper</a>
                        </Link>
                    </li>
                </ul>
            </section>
        </Layout>
    )
}

export default Home
