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
                            <a>Demo Walkthrough (Simple Example Use Case)</a>
                        </Link>


                    </li>
                    <div className='link-description'>
                        No wallet connection or signatures needed.
                    </div>

                    <li>
                        <Link href={'/scenarios/verification'}>
                            <a>Demo Walkthrough (Technical - Behind the Scenes)</a>
                        </Link>
                    </li>
                    <div className='link-description'>
                        For full functionality, you will need to connect your Algorand wallet via the Pera Wallet mobile app and WalletConnect.
                    </div>
                    <div className='link-description'>
                        You can still see what is going on behind the scenes without a connected wallet.
                    </div>
                    <li>
                        <Link href={'https://blockin.gitbook.io/blockin/'}>
                            <a>Blockin Documentation</a>
                        </Link>
                    </li>
                    <div className='link-description'>
                        Thorough documentation of Blockin. If you have any questions, this should be the first place to look.
                    </div>
                    <li>
                        <Link href={'https://github.com/matt-davison/blockin/blob/main/assets/Blockin_Paper.pdf'}>
                            <a>Blockin Paper</a>
                        </Link>
                    </li>
                    <div className='link-description'>
                        Paper explaining all the technical aspects of Blockin.
                    </div>
                    <li>
                        <Link href={'https://github.com/matt-davison/blockin'}>
                            <a>GitHub - Blockin Library</a>
                        </Link>
                    </li>
                    <div className='link-description'>
                        Source code for the core Blockin library code.
                    </div>
                    <li>
                        <Link href={'https://github.com/kking935/Blockin-Demo'}>
                            <a>GitHub - Demo Site</a>
                        </Link>
                    </li>
                    <div className='link-description'>
                        Source code for this demo site.
                    </div>
                </ul>
            </section>
        </Layout>
    )
}

export default Home
