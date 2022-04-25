/* eslint-disable react-hooks/exhaustive-deps */
import Layout from '../../components/layout'
import Head from 'next/head'
import React, { SyntheticEvent, useEffect, useState } from 'react'
import { getChallenge, signChallenge, getAssets } from '../../wallet/sign_challenge';
import { NextPage } from 'next/types';
import { useWalletContext } from '../../contexts/WalletContext';
import { useCookies } from 'react-cookie'
import { simulatedOwnedAssetColors, simulatedOwnedAssetHTMLColors, simulatedOwnedAssets } from '../../permissions/permissions';
import { signAssetCreateTxn } from '../../wallet/sign_asset_create_txn';

const loadingScreen = <>
    <p>Go to your wallet and accept the challenge request...</p>
</>

const successScreen = <>
    <p>Challenge succeeded!</p>
    <p>You are now authenticated.</p>
    <p>If you specified an asset ID, you should see the banner at the top of this page change colors!</p>
</>

const failureScreen = <>
    <p>Challenge failed!</p>
    <p>You are NOT authenticated</p>
</>

const Verification: NextPage = () => {
    const { connector } = useWalletContext()
    const [signingChallenge, setSigningChallenge] = useState(false)
    const [message, setMessage] = useState(loadingScreen);
    const [challenge, setChallenge] = useState('');

    const [cookies, setCookie] = useCookies(['blockedin']);
    const [assetId, setAssetId] = useState('');
    const [assetIds, setAssetIds] = useState<string[]>([]);
    const [ownedAssets, setOwnedAssets] = useState<any[]>([]);
    const [creatingAsset, setCreatingAsset] = useState(false);

    useEffect(() => {
        handleGetChallenge();
    }, [assetId, assetIds, connector]);

    useEffect(() => {
        getOwnedAssets();
    }, [connector]);

    useEffect(() => {
        getOwnedAssets();
    }, []);

    const handleGetChallenge = async () => {
        if (connector != undefined) {
            const blockinChallenge = await getChallenge(connector, assetIds);
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
                setCookie('blockedin', assetIds[0], { 'path': '/' });
            }
        }
    }

    const getOwnedAssets = async () => {
        const address = connector?.accounts[0];
        if (address) {
            const assets = await getAssets(connector.accounts[0]);
            setOwnedAssets(assets);
        }
    }

    const createAsset = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (connector == undefined) {
            console.log("Failed to call signAssetCreateTxn because connector is undefined")
            return
        }

        setCreatingAsset(true);
        await signAssetCreateTxn(connector, '');

        getOwnedAssets();
        setCreatingAsset(false);
    }



    return (
        <Layout>
            <Head>
                <title>Verification - Challenge/Response</title>
            </Head>
            <h1>Welcome to the Blockin Verification Demo!</h1>
            <p>This demo walks you through the flow and behind the scenes of signing in using Blockin. For this demo, we are going to have the sign-in privileges specified below, but note that any website can create their own assets and have sign-in privileges custom to their created assets using the Blockin library!</p>
            <ul>
                {simulatedOwnedAssets.map((elem, idx) => {
                    return <li key={elem}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>Asset ID ends in a {idx} or a {idx + 5}</div>
                        <div>{simulatedOwnedAssetColors[idx]} Banner</div>
                    </div>
                    </li>
                })}
            </ul>
            <hr />
            <h2><b>Step 1: You must own the assets in your wallet.</b></h2>

            <div className='ownedassets'>
                <p>You currently own these assets: </p>
                <ul>
                    {ownedAssets.map((elem, idx) => {
                        if (elem['amount'] <= 0) return;

                        return <li key={elem}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <a className='asset-link' href={`https://testnet.algoexplorer.io/asset/${elem['asset-id']}`} target="_blank" rel="noreferrer">
                                    {elem['asset-id']}
                                </a>
                                {' '} ({simulatedOwnedAssetColors[elem['asset-id'] % 5]} Banner)
                                {' '}(x{elem['amount']})
                            </div>
                        </div>
                        </li>
                    })}
                </ul>
                <ul>
                    {ownedAssets.length == 0 && <li>None</li>}
                </ul>
            </div>
            <hr />
            <div className='ownedassets'>
                <p>Click below to create a new asset with a random ID. You will have to sign the creation transaction in your wallet.</p>
                <button type='submit' onClick={createAsset}>Generate New Asset</button>
                {creatingAsset && <p>Awaiting Algorand confirmation of asset creation...</p>}
            </div>
            {/* <p>*If you request one of these assets in the challenge and are approved, the banner at the top of this page will change colors. Note that you must own the asset in your wallet.</p> */}
            <hr />

            <h2><b>Step 2: Choose the assets you would like to add to the sign-in challenge.</b></h2>
            <div className='ownedassets'>
                <ul>
                    {ownedAssets.map((elem, idx) => {
                        if (elem['amount'] <= 0) return;

                        return <li key={elem}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <a className='asset-link' href={`https://testnet.algoexplorer.io/asset/${elem['asset-id']}`} target="_blank" rel="noreferrer">
                                    {elem['asset-id']}
                                </a> {' '} ({simulatedOwnedAssetColors[elem['asset-id'] % 5]} Banner)
                            </div>
                            <button type='submit' onClick={() => {
                                setAssetIds([...assetIds, elem['asset-id']]);
                            }}>Add to Challenge</button>
                        </div>
                        </li>
                    })}
                </ul>
            </div>
            <p>*These are the assets that you currently own in your connected wallet. You can use the faucet above to add more.</p>
            <hr />
            <b>Add Custom Asset IDs</b>
            <div className='assetidinput'>
                <input value={assetId} type="number" placeholder='Add Asset ID #' onChange={e => setAssetId(e.target.value)} />
                <button type='submit' onClick={() => {
                    if (!assetId) return;
                    setAssetIds([...assetIds, assetId]);
                    setAssetId('');
                }}>Add to Challenge</button>
            </div>
            <p>*Note that if you add an asset ID that you do not own, your login attempt will be denied.</p>

            <hr />
            <b>Asset IDs to Add to the Challenge</b>
            <ul>
                {assetIds.map((elem, idx) => {
                    let index = Number(elem) % 5;

                    return <div key={elem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <li ><div>
                            <a className='asset-link' href={`https://testnet.algoexplorer.io/asset/${elem}`} target="_blank" rel="noreferrer">
                                {elem}</a>{' '} {index >= 0 && <>({simulatedOwnedAssetColors[index]} Banner)</>}</div></li>
                    </div>
                })}
            </ul>
            <button type='submit' onClick={() => {
                setAssetIds([]);
                setAssetId('');
            }}>Reset</button>
            {/* 
            <div>
                <>
                    <button onClick={handleGetChallenge}>Generate Challenge</button>
                </>
            </div> */}
            <hr />
            <div>
                <h2><b>Step 3: Challenge is Generated</b></h2>
                <pre style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                    {
                        challenge
                    }
                </pre>
                <hr />
                <p>
                    {assetIds[0] ? <>
                        If approved, you can expect the banner at the top of this page to change to {simulatedOwnedAssetHTMLColors[Number(assetIds[0]) % 5]} because the first asset ID specified ends in a {Number(assetIds[0]) % 10} or a {(Number(assetIds[0]) + 5) % 10}.</>
                        : <>No asset IDs have been specified yet. You can still sign the challenge, but no custom sign-in privileges will be granted.</>}
                </p>
            </div>
            <hr />
            <h2><b>Step 4: Sign Challenge with Your Wallet</b></h2>
            <div style={{ marginBottom: 50, marginTop: 10 }}>

                {
                    signingChallenge ?
                        <>
                            {message}
                        </> :
                        <>

                        </>
                }
                <button disabled={!challenge} onClick={handleSignChallenge}> {
                    signingChallenge ?
                        <>
                            Resend Challenge
                        </> :
                        <>
                            Sign Challenge to Log In
                        </>
                }</button>
            </div>

        </Layout>
    )
}

export default Verification