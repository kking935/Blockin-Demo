import { NextPage } from 'next/types'
import Link from 'next/link'
import Layout from '../components/layout'
import { Expandable } from '../components/expandable'
import { SimpleDemo } from '../components/simpledemo'
import TechnicalDemo from '../components/technicaldemo'

const Home: NextPage = () => {
    return (
        <Layout>
            <section className='home'>
                <h2>Welcome to the Blockin Demo Site!</h2>
                <p>This site is intended to demonstrate Blockin, not to explain or get too technical. To learn more, click here.</p>
                <p>Also, note that this site shows how to use the Blockin library, but it is just a specific implementation. Any site can completely customize how they use the Blockin library.</p>
                <hr />
                {/* <p>The problem Blockin solves is that current sign-in standards (such as EIP-4361 Sign-In with Ethereum) are limited in two ways: 1) only capable of supporting a single chain at a time and 2) lack of role-based access control options.</p>
                <p> Not all users for a company like Netflix, for example, will all belong to the same blockchain. Blockin is capable of supporting sign-ins from any blockchain!</p>

                <p>Blockin also allows for the ability to include and verify ownership of on-chain assets (such as NFTs) with a sign-in request, something previously not possible.</p> */}
                <h2>Sign-In Demo</h2>
                <p>At the top of the page, you can experiment with a sample sign-in example using Blockin. Different banner colors are used to represent different sign-in privileges.</p>
                <p>The "Simulated Chain" option is provided for convenience. This allows you to successfully interact with this demo without connecting a wallet.</p>
                {/* <Expandable
                    special={true}
                    title="What is Blockin Used For?"
                    content={<>

                        <p>The problem Blockin is trying to solve is that existing Web 3.0 sign-in solutions are pretty limited. First, they are limited to a single blockchain at a time. Second, they don't natively support granting dynamic role-based privileges for different users.</p>
                        <p>For neutral applications (not belonging to one specific blockchain) such as a university, Netflix, or YouTube, all of their users are not going to be on a single blockchain. Everyone will have their own preferred blockchain. Blockin helps solve this problem.</p>
                        <p>Blockin also does not have to be used solely for multi-chain applications. It can be used with as many or as little chains as one would like.</p>
                    </>}
                />

                <Expandable
                    special={true}
                    title="How Does It Work?"
                    content={<>

                        <p>1. A sign-in request message will be generated. Blockin uses a universal standard for generating sign-in requests (i.e. not specific to any blockchain) which can optionally include on-chain assets (such as NFTs).</p>
                        <p>2. The user who wishes to sign in will select a blockchain of their choice.</p>
                        <p>3. The user will then sign the request with their private key from that blockchain.</p>
                        <p>4. Blockin will then verify the sign-in request using that blockchain's public state and cryptographic signature functions.</p>
                        <p>5. The resource provider will do any additional checks, if necessary.</p>
                        <p>6. The resource provider can grant the user access.</p>
                    </>}
                />

 */}
                <hr />

                <TechnicalDemo />

                {/* <hr />
                <h2>What does the "Simulated Chain" option mean?</h2> */}
            </section>
        </Layout >
    )
}

export default Home
