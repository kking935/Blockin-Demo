/* eslint-disable react-hooks/exhaustive-deps */
import Layout from '../../components/layout'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { getChallenge, signChallenge } from '../../wallet/sign_challenge';
import { NextPage } from 'next/types';
import { useWalletContext } from '../../contexts/WalletContext';
import { useCookies } from 'react-cookie'
import { simulatedOwnedAssetColors, simulatedOwnedAssets } from '../../permissions/permissions';

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
    const [message, setMessage] = useState(loadingScreen);
    const [challenge, setChallenge] = useState('');

    const [cookies, setCookie] = useCookies(['blockedin']);
    const [assetId, setAssetId] = useState('');
    const [assetIds, setAssetIds] = useState<string[]>([]);


    useEffect(() => {
        handleGetChallenge();
    }, [assetId, assetIds, connector]);

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



    return (
        <Layout>
            <Head>
                <title>Verification - Challenge/Response</title>
            </Head>
            <b>Your Owned Assets</b>
            <div className='ownedassets'>
                <ul>
                    {simulatedOwnedAssets.map((elem, idx) => {
                        return <li key={elem}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>{elem} ({simulatedOwnedAssetColors[idx]} Banner)</div>
                            <button type='submit' onClick={() => {
                                setAssetIds([...assetIds, elem]);
                            }}>Add</button>
                        </div>
                        </li>
                    })}
                </ul>
            </div>
            <p>*For demo purposes, these five asset IDs will be treated as if you own them.</p>
            <hr />
            <b>Add Custom Asset IDs</b>
            <div className='assetidinput'>
                <input value={assetId} type="number" placeholder='Add Asset ID #' onChange={e => setAssetId(e.target.value)} />
                <button type='submit' onClick={() => {
                    if (!assetId) return;
                    setAssetIds([...assetIds, assetId]);
                    setAssetId('');
                }}>Add Asset</button>
                <button type='submit' onClick={() => {
                    setAssetIds([]);
                    setAssetId('');
                }}>Reset</button>

            </div>
            <hr />
            {/* <p>*For demo purposes, the first asset ID specified will determine what color banner you have. If you specify an odd number, your website banner will turn green. If even, it will turn purple.</p> */}
            <b>Added Assets</b>
            <ul>
                {assetIds.map((elem, idx) => {
                    let index = simulatedOwnedAssets.indexOf(elem);

                    return <div key={elem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <li ><div>{elem} ({index >= 0 ? <>{simulatedOwnedAssetColors[index]} Banner</> : <>Custom</>})</div></li>
                    </div>
                })}
            </ul>

            {/* 
            <div>
                <>
                    <button onClick={handleGetChallenge}>Generate Challenge</button>
                </>
            </div> */}
            <hr />
            <div>
                <b>Challenge</b>
                <br />
                <pre style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                    {
                        challenge
                    }
                </pre>

            </div>
            <hr />
            <div style={{ marginBottom: 50 }}>
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