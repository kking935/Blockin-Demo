/* eslint-disable react-hooks/exhaustive-deps */
import Layout from '../../components/layout'
import React, { useState } from 'react'
import { signChallenge } from '../../blockin-walletconnect-helpers/sign_challenge';
import { NextPage } from 'next/types';
import { useWalletContext } from '../../contexts/WalletContext';
import ConnectScreen from '../../components/connectScreen';
import { SignInWithBlockinButton } from '../../components/signinbutton';
import { stringify } from '../../utils/preserveJson';
import { useCookies } from 'react-cookie';
import { ChallengeParams, EIP4361Challenge } from '../../../blockin/src';

interface VerifyChallengeRequest {
    originalBytes?: Uint8Array;
    signatureBytes?: Uint8Array;
    message?: string;
}

interface VerifyChallengeResponse {
    success: boolean;
    message: string;
    challenge: ChallengeParams
}

const SampleButton: NextPage = () => {
    const { connector } = useWalletContext();
    const [chain, setChain] = useState('Algorand');
    const [cookies, setCookie] = useCookies(['family', 'standard', 'normal']);

    const handleSignChallenge = async (challenge: string) => {
        if (connector) {
            const signChallengeResponse: VerifyChallengeRequest = await signChallenge(connector, challenge);

            if (!signChallengeResponse.signatureBytes || !signChallengeResponse.originalBytes) {
                return {
                    message: 'Error: Problem signing challenge'
                }
            } else {
                return signChallengeResponse;
            }
        } else {
            return {
                message: 'Error: Connector is undefined'
            }
        }
    }

    const handleVerifyChallengeOnBackend = async (originalBytes: Uint8Array, signatureBytes: Uint8Array) => {
        const verificationRes = await fetch('../api/verifyChallenge', {
            method: 'post',
            body: stringify({ originalBytes, signatureBytes, chain }), //hack to preserve Uint8 arrays over HTTP requests
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json());

        return verificationRes;
    }

    return (
        <Layout>
            <ConnectScreen />

            <SignInWithBlockinButton
                challengeParams={
                    {
                        domain: 'https://blockin.com',
                        statement: 'Sign in to this website via Blockin. You will remain signed in until you terminate your browser session.',
                        address: connector?.accounts[0] ? connector?.accounts[0] : '',
                        uri: 'https://blockin.com/login'
                    }
                }
                chain={chain}
                displayedAssets={[{
                    name: 'Family Plan',
                    assetId: '88007716',
                    description: 'This asset represents a family plan membership. You must have a minimum balance of 1 of this asset in your wallet to receive family plan privileges.'
                }, {
                    name: 'Standard Plan',
                    assetId: '87987698',
                    description: 'This asset represents a standard plan membership. You must have a minimum balance of 1 of this asset in your wallet to receive standard plan privileges.'
                }]}
                displayedUris={[{
                    name: 'Standard Access',
                    uri: 'https://blockin.com',
                    description: 'Anyone who verifies with a valid crypto address can be granted standard access.'
                }]}
                signAndVerifyChallenge={async (challenge: string) => {
                    /**
                     * This is where you handle the signChallenge request for your wallet provider of choice. This site is 
                     * currently using Algorand and WalletConnect. 
                     * 
                     * It is expected to return two arguments: originalBytes: Uint8Array (the bytes that were signed) and 
                     * signatureBytes: Uint8Array (the signature bytes). If either is not returned, we return a failure.
                     */
                    const signChallengeResponse: VerifyChallengeRequest = await handleSignChallenge(challenge);
                    if (!signChallengeResponse.signatureBytes || !signChallengeResponse.originalBytes) {
                        return { success: false, message: `Error: Problem signing challenge: ${signChallengeResponse.message}` }
                    }

                    /**
                     * This is where you handle the verification on the backend of your resource provider. Here, you must
                     * first call Blockin's verifyChallenge(), include any other additional validity checks that you wish, and
                     * finally, perform whatever actions are needed to authenticate the user like JWTs, session tokens, etc.
                     * 
                     * It is expected to return a boolean named success (whether the verification checked succeeded or not)
                     */
                    const verifyChallengeOnBackendResponse: VerifyChallengeResponse = await handleVerifyChallengeOnBackend(signChallengeResponse.originalBytes, signChallengeResponse.signatureBytes);
                    if (!verifyChallengeOnBackendResponse.success) {
                        return { success: false, message: `Error: Problem verifying challenge on backend: ${verifyChallengeOnBackendResponse.message}` }
                    }

                    const constructedChallenge: ChallengeParams = verifyChallengeOnBackendResponse.challenge;

                    /**
                     * If you reached here, both Blockin and the backend has verified the challenge request.
                     * Here, you will define anything else you need to do on the frontend such as set cookies, JWTs,
                     * React state variables, etc. 
                     */
                    if (constructedChallenge.resources && constructedChallenge.resources.includes('Asset ID: 88007716')) {
                        setCookie('family', true, { 'path': '/' });
                    }
                    if (constructedChallenge.resources && constructedChallenge.resources.includes('Asset ID: 87987698')) {
                        setCookie('standard', true, { 'path': '/' });
                    }
                    if (constructedChallenge.resources && constructedChallenge.resources.includes('https://blockin.com')) {
                        setCookie('normal', true, { 'path': '/' });
                    }

                    return { success: true, message: 'Successfully granted access via Blockin.' };
                }}
                generateNonce={async () => { return 'abc123' }}
            // hideResources={true}
            />
        </Layout>
    )
}

export default SampleButton;