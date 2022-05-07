import { NextPage } from 'next/types'
import Link from 'next/link'
import Layout from '../components/layout'

const Home: NextPage = () => {
    return (
        <Layout>
            <section className='home'>
                <h2>Welcome to Blockin Demo</h2>
                <h3>Explore the links below</h3>
                <ul>
                    <li>
                        <Link href={'/scenarios/simpleverification'}>
                            <a>Demo Walkthrough (Simple)</a>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/scenarios/verification'}>
                            <a>Demo Walkthrough (Technical)</a>
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
