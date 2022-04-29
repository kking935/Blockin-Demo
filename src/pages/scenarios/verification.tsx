/* eslint-disable react-hooks/exhaustive-deps */
import Layout from '../../components/layout'
import Head from 'next/head'
import React, { SyntheticEvent, useEffect, useState } from 'react'
import { getChallenge, signChallenge, getAssets, getAsset } from '../../wallet/sign_challenge';
import { NextPage } from 'next/types';
import { useWalletContext } from '../../contexts/WalletContext';
import { useCookies } from 'react-cookie'
import { getColorFromMetadata } from '../../permissions/permissions';
import { signAssetCreateTxn } from '../../wallet/sign_asset_create_txn';
import { sha256, sha256AsString } from '../../../blockin/dist';

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
    const [assetInfoMap, setAssetInfoMap] = useState<any>({});
    const [creatingAsset, setCreatingAsset] = useState(false);
    const [metadata, setMetadata] = useState('');


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
            const newAssetMap: any = assetInfoMap;

            const assets = await getAssets(connector.accounts[0]);

            for (const asset of assets) {
                const id: string = asset['asset-id'];
                if (!newAssetMap[id]) {
                    const assetInfo = await getAsset(Number(id));
                    newAssetMap[id] = assetInfo;
                }

                asset['color'] = await getColorFromMetadata(newAssetMap[id]['metadata-hash']);


                if (!asset['color']) {
                    asset['color'] = 'Custom';
                } else {
                    asset['color'] = asset['color'].charAt(0).toUpperCase() + asset['color'].slice(1);
                }
            }

            setAssetInfoMap(newAssetMap);
            console.log(newAssetMap);


            console.log(assets);

            setOwnedAssets(assets);
        }


    }

    const createAsset = async (e: SyntheticEvent) => {
        e.preventDefault();

        console.log(metadata, "METADATA", await sha256AsString(metadata));
        const sha = await sha256(metadata);
        const shaStr = new TextDecoder().decode(sha);
        console.log(metadata, "METADATA", shaStr);

        if (connector == undefined) {
            console.log("Failed to call signAssetCreateTxn because connector is undefined")
            return;
        }

        setCreatingAsset(true);
        await signAssetCreateTxn(connector, metadata);

        getOwnedAssets();
        setCreatingAsset(false);
    }

    const [firstColor, setFirstColor] = useState('');

    return (
        <Layout>
            <Head>
                <title>Verification - Challenge/Response</title>
            </Head>
            <h1>Welcome to the Blockin Verification Demo!</h1>
            <p>This demo walks you through the flow and behind the scenes of signing in using Blockin.
                For this demo, we will be simulating different sign-in privileges and role based access through changing the color of the banner at the top of this page. To determine the color, we will look at the metadata hash of the requested asset to see what color was requested. Note that this is just our client-side implementation of Blockin. Any website can create their own assets and have sign-in privileges custom to their created assets and their metadata hashes using the Blockin library!</p>

            <hr />
            <b>Metadata Hash (Behind the Scenes)</b>
            <p>{"Algorand allows 32 bytes for a metadata hash to be stored on-chain for each asset. These 32 bytes can be used in anyway that the authorizing resource would like to (encryption, hashes, plaintext, etc.)."}</p>

            <p>{"For our site, we use the metadata scheme below, but note that Blockin allows anyone to create their own scheme!"}</p>

            <p>{"We start with a valid HTML color name in plaintext such as 'red'. We then apply the following function to the plaintext to get the 32 bytes metadata hash: Base64(SHA256(plaintext))."}</p>

            <p>{"For example, this asset ("}
                <a className='asset-link' href={`https://testnet.algoexplorer.io/asset/${86695725}`} target="_blank" rel="noreferrer">
                    86695725
                </a>
                {") used 'red' as its color and the output of Base64(SHA256('red'))) is 'sfUaUR8doM00i4+FmNsy5hy5Y+X8aeK0FIW/mVkO11o='"}
            </p>

            <p>{"If you "}
                <a className='asset-link' href={`https://testnet.algoexplorer.io/asset/${86695725}`} target="_blank" rel="noreferrer">
                    click here
                </a>{" and go to the 'Technical Information' tab, you can see the metadata hash is indeed 'sfUaUR8doM00i4+FmNsy5hy5Y+X8aeK0FIW/mVkO11o='."}
            </p>

            <p>{"Now whenever a user requests to sign in with this asset using Blockin, the authorizer can use this metadata hash to grant role-based privileges. For the example asset above, the metadata hash will correspond to the 'red' banner color privilege."}</p>

            <hr />
            <h2><b>Step 0: The assets must be created on the blockchain.</b></h2>
            <p>This step will be skipped if the assets are already created on-chain. Asset creation is a one-time process. Users must go through steps 1-4 everytime they wish to be authorized. </p>
            <hr />
            <div className='ownedassets'>
                <b>Generate New Asset (User Creates)</b>
                <p>Click below to create a new asset. You may specify a metadata color in the input box below. You will have to sign the creation transaction in your wallet.</p>
                <p>{"This simulates the 'User Creates' method of creating an asset. For this method, the user defines the metadata and sends the create asset transaction to the blockchain."}</p>

                <div className='assetidinput'>
                    <input value={metadata} type="text" placeholder='Add Color Name...' onChange={e => setMetadata(e.target.value)} />
                </div>
                <p>*Note that for this website, only HTML color names are supported (no hex values). For more info, <a className='asset-link' href="https://www.w3schools.com/tags/ref_colornames.asp" target="_blank" rel="noreferrer">click here</a>.</p>

                <button type='submit' onClick={createAsset}>Generate New Asset (User Creates)</button>
                {creatingAsset && <p>Awaiting Algorand confirmation of asset creation...</p>}
            </div>
            {/* <p>*If you request one of these assets in the challenge and are approved, the banner at the top of this page will change colors. Note that you must own the asset in your wallet.</p> */}
            <hr />
            <div className='ownedassets'>
                <b>Generate New Asset (Resource Creates)</b>
                <p>Click below to request to receive a new asset from the authorizing resource. You will have to sign transaction(s) in your wallet.</p>
                <p>{"This simulates the 'Resource Creates' method of creating an asset. For this method, the resource will define the metadata and send the create asset transaction to the blockchain. The asset will then be sent to the user's address."}</p>

                <button type='submit' onClick={createAsset}>Generate New Asset (Resource Creates)</button>
                {creatingAsset && <p>Awaiting Algorand confirmation of asset creation...</p>}
            </div>
            <hr />
            <div className='ownedassets'>
                <b>Generate New Asset (Smart Contract Creates)</b>
                <p>Click below to request to receive a new asset via a smart contract. You will have to sign transaction(s) in your wallet.</p>
                <p>{"This simulates the 'Smart Contract Creates' method of creating an asset. For this method, the smart contract will define the metadata and send the create asset transaction to the blockchain. The asset will then be sent to the user's address."}</p>

                <button type='submit' onClick={createAsset}>Generate New Asset (Smart Contract Creates)</button>
                {creatingAsset && <p>Awaiting Algorand confirmation of asset creation...</p>}
            </div>
            <hr />
            <h2><b>Step 1: You must own the assets you wish to sign in with in your wallet.</b></h2>

            <div className='ownedassets'>
                <b>Your Owned Assets</b>
                <ul>
                    {ownedAssets.map((elem, idx) => {
                        if (elem['amount'] <= 0) return;

                        return <li key={elem}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <a className='asset-link' href={`https://testnet.algoexplorer.io/asset/${elem['asset-id']}`} target="_blank" rel="noreferrer">
                                    {elem['asset-id']}
                                </a>
                                {' '} ({elem['color']} Banner)
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
            <p>{"*Go back to Step 0 if you need to generate a new asset."}</p>
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
                                </a> {' '} ({elem['color']} Banner)
                            </div>
                            <button type='submit' onClick={async () => {
                                const newArr = [...assetIds, elem['asset-id']]
                                setAssetIds(newArr);
                                if (!newArr[0]) return;
                                const color = await getColorFromMetadata(assetInfoMap[newArr[0]]['metadata-hash'])
                                if (color) setFirstColor(color.charAt(0).toUpperCase() + color.slice(1));
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
                <button type='submit' onClick={async () => {
                    if (!assetId) return;
                    const newArr = [...assetIds, assetId]
                    setAssetIds(newArr);
                    setAssetId('');
                    if (!newArr[0]) return;
                    const color = await getColorFromMetadata(assetInfoMap[newArr[0]]['metadata-hash'])
                    if (color) setFirstColor(color.charAt(0).toUpperCase() + color.slice(1));
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
                                {elem}</a>{' '}{idx == 0 && <>({firstColor ? firstColor : 'Custom'} Banner)</>}
                        </div></li>
                    </div>
                })}
            </ul>
            <button type='submit' onClick={() => {
                setAssetIds([]);
                setAssetId('');
                setFirstColor('');
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
            </div>
            <p>*Note that all fields within the challenge can be customized when calling createChallenge() in Blockin.</p>
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