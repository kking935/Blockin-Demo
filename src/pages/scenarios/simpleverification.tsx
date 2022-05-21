/* eslint-disable react-hooks/exhaustive-deps */
import Layout from '../../components/layout'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { getChallenge, getAssets, signChallenge } from '../../blockin-walletconnect-helpers/sign_challenge';
import { NextPage } from 'next/types';
import { useWalletContext } from '../../contexts/WalletContext';
import { getColorFromMetadata } from '../../permissions/permissions';
import { Step } from '../../components/step';
import ConnectScreen from '../../components/connectScreen';

const loadingMessage = <>
    <p>Go to your wallet and accept the challenge request...</p>
</>

const successMessage = <>
    <p>You have signed the challenge with your wallet successfully.</p>
</>

const failureMessage = <>
    <p>Challenge failed!</p>
    <p>You are NOT authenticated</p>
</>


const Verification: NextPage = () => {
    const { connector } = useWalletContext()
    const [challenge, setChallenge] = useState('');

    const [assetId, setAssetId] = useState('');
    const [assetIds, setAssetIds] = useState<string[]>([]);
    const [userIsSigningChallenge, setUserIsSigningChallenge] = useState(false);
    const [displayMessage, setDisplayMessage] = useState(<p></p>);
    const [userSignedChallenge, setUserSignedChallenge] = useState(false);

    const [ownedAssets, setOwnedAssets] = useState<any[]>([]);
    const [assetInfoMap, setAssetInfoMap] = useState<any>({});
    const [signInColor, setSignInColor] = useState('');

    const [plan, setPlan] = useState('');

    const addAssetIdToChallenge = async (assetId: string) => {
        if (!assetId) return;
        const newArr = [...assetIds, assetId]
        setAssetIds(newArr);
        await updateSignInColor(newArr);
    }

    const updateSignInColor = async (arr: string[]) => {
        if (!arr[0]) return;
        const color = await getColorFromMetadata(assetInfoMap[arr[0]]['metadata-hash'])
        if (color) setSignInColor(color.charAt(0).toUpperCase() + color.slice(1));
    }

    useEffect(() => {
        updateChallenge();
    }, [assetId, assetIds, connector]);

    useEffect(() => {
        updateOwnedAssets();
    }, [connector]);

    useEffect(() => {
        updateOwnedAssets();
    }, []);

    const updateChallenge = async () => {
        if (connector != undefined) {
            const blockinChallenge = await getChallenge(connector, assetIds);
            setChallenge(blockinChallenge);
        }
    }

    const updateOwnedAssets = async () => {
        const address = connector?.accounts[0];
        if (address) {
            const { assets, assetMap } = await getAssets(connector.accounts[0], assetInfoMap, true);
            setAssetInfoMap(assetMap);
            setOwnedAssets(assets);
        }
    }

    const handleSignChallenge = async () => {
        // setUserIsSigningChallenge(true);
        // setDisplayMessage(loadingMessage);

        // if (connector != undefined) {
        //     const response = await signChallenge(connector, challenge);

        //     if (!response.signatureBytes || !response.originalBytes) {
        //         setDisplayMessage(failureMessage);
        //         setUserIsSigningChallenge(false)
        //     }
        //     else {
        setDisplayMessage(successMessage);
        setUserSignedChallenge(true);
        //     }
        // }
    }


    return (
        <Layout>
            <ConnectScreen />

            <h1>Welcome to the Log in with Blockin Demo!</h1>
            <p>{"This demo walks you through a simple flow of signing in with Blockin using Netflix standard and family plans as an example."}</p>
            <p>{"Assume that Netflix has created both a family plan asset and standard plan asset on-chain. "}<b>You buy the family plan, and they send you the family plan asset to your wallet. You do not own the standard plan asset.</b></p>
            <hr />
            <Step
                title='Step 1: Choose Plan'
                description='Suppose you are browsing the Netflix app, and they are asking you to sign in. They ask you to select the plan you want to sign in with.'
                content={<>
                    <button disabled={userSignedChallenge} onClick={() => setPlan('family')}>Select Family Plan</button>
                    <button disabled={userSignedChallenge} onClick={() => setPlan('standard ')}>Select Standard Plan</button>
                    {plan && <b><p>You have selected the {plan} plan.</p></b>}
                    <hr />
                </>}
            />

            <Step
                title='Step 2: Netflix Generates a Sign-In Challenge and Asks You to Sign It'
                description='Netflix wants to verify that you actually own the plan you say you own. They generate a Blockin challenge and ask you to sign it with your wallet.'
                content={
                    <>
                        <button onClick={handleSignChallenge} disabled={!plan}>Sign Challenge</button>
                        {displayMessage}
                        <hr />
                    </>

                }
            />

            <Step
                title='Step 3: Blockin Verification'
                description='Blockin will a) check the challenge signature to verify it was you who actually signed it and b) check the blockchain to see if your wallet actually owns the asset corresponding to the plan you selected.'
                content={
                    <>
                        {userSignedChallenge && <>
                            {plan === 'family' && <>
                                <b><p>You have selected to sign in with the family plan.</p>
                                    <p>Blockin has scanned the blockchain and verified that you do indeed own the family plan asset! Netflix can now safely grant you family plan access!</p></b>
                            </>}
                            {plan !== 'family' && <>
                                <b><p>You have selected to sign in with the {plan} plan.</p>
                                    <p>Blockin has scanned the blockchain and has noticed that you do not own the {plan} plan asset. Netflix has denied your sign-in request.</p></b>
                            </>}
                            <hr />
                            <p>*If you have not already, refresh the page and try to sign in with a different plan.</p>
                        </>}
                    </>
                }
            />
        </Layout>
    )
}

export default Verification