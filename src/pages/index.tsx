import { NextPage } from 'next/types'
import Link from 'next/link'
import Layout from '../components/layout'

const Home: NextPage = () => {
    return (
        <Layout>
            <section className='home'>
                <h2>Your wallet is connected</h2>
                <h3>Explore the links below</h3>
                <ul>
                    <li>
                        <Link href={'/scenarios/samplebutton'}>
                            <a>Sign In With Blockin Button</a>
                        </Link>
                    </li>
                </ul>
            </section>
        </Layout>
    )
}

export default Home
