import { NextPage } from 'next/types'
import Link from 'next/link'
import Layout from '../components/layout'

const Home: NextPage = () => {
    return (
        <Layout>
            <section className='home'>
                <h2>Welcome to the Blockin Demo</h2>
                <p>Blockin is a universal, multi-chain sign-in standard for Web 3.0 that supports many other features such as micro-authorizations and role-based access control!</p>

                <p>The problem Blockin solves is that current sign-in standards (such as EIP-4361 Sign-In with Ethereum) are limited. Not all users for a company like Netflix, for example, will all belong to the same blockchain. Blockin is capable of supporting sign-ins from any blockchain!</p>

                <p>Note that this site is built for Algorand and Pera Wallet through WalletConnect. To gain full functionality for logging in and the technical demo, you will need to connect via the Pera Wallet mobile app. However, everything else does not require a wallet connection.</p>

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
