import Layout from '../../components/layout'
import Head from 'next/head'
import React, { useState } from 'react'
import { signChallenge } from '../../wallet/sign_challenge';
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

    const handleChallenge = async () => {
        setSigningChallenge(true)
        if (connector != undefined && await signChallenge(connector)) {
            setMessage(successScreen)
        }
        else {
            setMessage(failureScreen)
        }
    }

    return (
        <Layout>
            <Head>
                <title>Verification - Challenge/Response</title>
            </Head>
            <div>
                {
                    signingChallenge ?
                    <>
                        {message}
                    </> :
                    <>
                        <button onClick={handleChallenge}>Sign Challenge</button>
                    </>
                }
            </div>
        </Layout>
    )
}

export default Verification