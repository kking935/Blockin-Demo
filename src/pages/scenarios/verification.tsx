import Layout from '../../components/layout'
import Head from 'next/head'
import React, { useState } from 'react'
import { getChallenge, signChallenge } from '../../wallet/sign_challenge';
import { NextPage } from 'next/types';
import { useWalletContext } from '../../contexts/WalletContext';

const loadingScreen = <>
    <p>Go to your wallet and accept the challenge request...</p>
</>

const successScreen = <>
    <p>Challenge succeeded!</p>
    <p>You are now authenticated</p>
</>

const failureScreen = <>
    <p>Challenge failed!</p>
    <p>You are NOT authenticated</p>
</>

const Verification: NextPage = () => {
    const { connector } = useWalletContext()
    const [signingChallenge, setSigningChallenge] = useState(false)
    const [message, setMessage] = useState(loadingScreen)

    const [challenge, setChallenge] = useState('');

    const handleGetChallenge = async () => {
        if (connector != undefined) {
            const blockinChallenge = await getChallenge(connector, ['13365375']);
            setChallenge(blockinChallenge);
        }
        else {
            setMessage(failureScreen)
        }
    }

    const handleSignChallenge = async () => {
        setSigningChallenge(true);
        setMessage(loadingScreen);

        if (connector != undefined) {
            const response = await signChallenge(connector, challenge);
            console.log(response);
            alert(response);

            if (response.startsWith('Error')) {
                setMessage(failureScreen);
                setSigningChallenge(false)
            }
            else {
                setMessage(successScreen);
            }
        }

    }

    return (
        <Layout>
            <Head>
                <title>Verification - Challenge/Response</title>
            </Head>
            <div>
                <>
                    <button onClick={handleGetChallenge}>Generate Challenge</button>
                </>
            </div>
            <div>
                Generated Challenge:<br />
                <pre>
                    {
                        challenge
                    }
                </pre>

            </div>
            <hr />
            <div>
                {
                    signingChallenge ?
                        <>
                            {message}
                        </> :
                        <>
                            <button disabled={!challenge} onClick={handleSignChallenge}>Sign Challenge</button>
                        </>
                }
            </div>

        </Layout>
    )
}

export default Verification