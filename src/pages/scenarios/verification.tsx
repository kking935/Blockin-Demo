/* eslint-disable react-hooks/exhaustive-deps */
import Layout from '../../components/layout'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { getChallenge, getAssets } from '../../blockin-walletconnect-helpers/sign_challenge';
import { NextPage } from 'next/types';
import { useWalletContext } from '../../contexts/WalletContext';
import { getColorFromMetadata } from '../../permissions/permissions';
import { SignChallengeButton } from '../../components/buttons/sign_challenge_button';
import { SignOptInButton } from '../../components/buttons/sign_opt_in_button';
import { ResourceCreateAssetButton } from '../../components/buttons/resource_create_asset_button';
import { AssetLink } from '../../components/assetLink';
import { ReceiveAssetFromResourceButton } from '../../components/buttons/resource_receive_asset_button';
import { UserCreatesForm } from '../../components/forms/user_create_asset_form';
import { LocalContractCreatesForm } from '../../components/forms/local_contract_create_asset_form';
import { Expandable } from '../../components/expandable';
import { Step } from '../../components/step';
import { AssetIdList, AssetList } from '../../components/assetList';
import ConnectScreen from '../../components/connectScreen';
import { ContractOptInButton } from '../../components/buttons/contract_opt_in_button';
import { LocalContractRetrieveAssetButton } from '../../components/buttons/local_contract_retrieve_button';

const SAMPLE_ASSET_ID = '86695725';

const contractId = process.env.NEXT_PUBLIC_LOCAL_CONTRACT_ID ?? "0";

const Verification: NextPage = () => {
    const { connector } = useWalletContext()
    const [challenge, setChallenge] = useState('');

    const [assetId, setAssetId] = useState('');
    const [assetIds, setAssetIds] = useState<string[]>([]);

    const [ownedAssets, setOwnedAssets] = useState<any[]>([]);
    const [assetInfoMap, setAssetInfoMap] = useState<any>({});
    const [signInColor, setSignInColor] = useState('');

    const [resourceCreatesAssetId, setResourceCreatesAssetId] = useState('');
    const [resourceCreatesOptedIn, setResourceCreatesOptedIn] = useState(false);

    const [smartContractCreatesLocalAssetId, setSmartContractCreatesLocalAssetId] = useState('');
    const [smartContractCreatesLocalOptedIn, setSmartContractCreatesLocalOptedIn] = useState(false);
    const [smartContractCreatesLocalAssetOptedIn, setSmartContractCreatesLocalAssetOptedIn] = useState(false);


    const addAssetIdToChallenge = async (assetId: string) => {
        if (!assetId) return;
        const newArr = [...assetIds, assetId]
        setAssetIds(newArr);
        await updateSignInColor(newArr);
    }

    const updateSignInColor = async (arr: string[]) => {
        if (!arr[0] || !assetInfoMap[arr[0]]) return;
        const color = await getColorFromMetadata(assetInfoMap[arr[0]]['metadata-hash'])
        if (color) setSignInColor(color.charAt(0).toUpperCase() + color.slice(1));
    }

    const clearChallenge = () => {
        setAssetIds([]);
        setAssetId('');
        setSignInColor('');
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
            console.log(blockinChallenge);
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

    const getVerifyChallengeSuccess = async () => {
        return { success: true, message: 'Successfully granted access via Blockin.' };
    }

    const getVerifyChallengeFailure = async () => {
        return { success: false, message: 'We encountered a problem verifying the challenge.' };
    }

    const handleSignChallengeFailure = async (challenge: string) => {
        return {
            message: 'We encountered a problem signing the challenge.'
        }
    }

    const handleSignChallengeSuccess = async (challenge: string) => {
        return {
            originalBytes: new Uint8Array(23),
            signatureBytes: new Uint8Array(23),
            message: 'Success signing challenge'
        }
    }

    return (
        <Layout>

            <ConnectScreen />

            <div className='verification'>
                <h1>Welcome to the Log in with Blockin Demo!</h1>
                <p>{"This demo walks you through the flow and behind the scenes of signing in using Blockin. For this demo, we will be simulating different sign-in privileges and role based access through changing the color of the banner at the top of this page. To determine the banner color, we will look at the asset's metadata hash which is stored on-chain. "}</p>
                <p>{"Note that this is just our demo site's custom implementation using Blockin. Any website can create their own assets and have sign-in privileges custom to their created assets using the Blockin JavaScript library!"}</p>
                <hr />

                <Expandable
                    special={true}
                    title="Metadata Hashes (Technical)"
                    content={<><p>{"Algorand allows 32 bytes for a metadata hash to be stored on-chain for each asset. These 32 bytes can be used in anyway that the authorizing resource would like to (encryption, hashes, plaintext, etc.)."}</p>
                        <p>{"The Blockin library does not enforce the metadata bytes to be used in any specific way. For our site, we use the metadata scheme below."}</p>
                        <p>{"We start with a valid HTML color name in plaintext such as 'red'. We then apply the following function to the plaintext to get the 32 bytes metadata hash: Base64(SHA256(plaintext))."}</p>
                        <p>{"For example, this asset ("}<AssetLink assetId={SAMPLE_ASSET_ID} />{") used 'red' as its color and the output of Base64(SHA256('red'))) is 'sfUaUR8doM00i4+FmNsy5hy5Y+X8aeK0FIW/mVkO11o='"}</p>
                        <p>{"If you "}<AssetLink assetId={SAMPLE_ASSET_ID} text='click here' />{" and go to the 'Technical Information' tab, you can see the metadata hash is indeed 'sfUaUR8doM00i4+FmNsy5hy5Y+X8aeK0FIW/mVkO11o='."}</p>
                        <p>{"Whenever a user requests to sign in with an asset using Blockin, the authorizing resource can use this metadata hash to grant role-based privileges. For example, the metadata hash from the asset above for our site will correspond to the red banner color privilege."}</p>
                    </>}
                />

                <Step
                    title='Step 0: Asset Creation'
                    description='This step will be skipped if the assets are already created on-chain. Asset creation is a one-time process. Users must go through steps 1-3 every time they wish to be authorized.'
                    content={<>
                        <Expandable
                            title="Generate New Asset (User Creates)"
                            content={<><p>Click below to create a new asset. You may specify a metadata color in the input box below. You will have to sign the creation transaction in your wallet.</p>
                                <p>{"This simulates the 'User Creates' method of creating an asset. For this method, the user will input the metadata and send the create asset transaction to the blockchain."}</p>
                                <p>{"Note that although you have complete freedom over your metadata for this example, it most likely will not be like this in reality. The authorizing resource can and should add additional validity checks enforcing that the metadata hash is well-formed for any specific user."}</p>
                                <UserCreatesForm updateOwnedAssets={updateOwnedAssets} />
                            </>}
                        />

                        <Expandable
                            title='Generate New Asset (Resource Creates)'
                            content={
                                <>
                                    <p>Click below to request to receive a new asset from the authorizing resource. You will have to sign a transaction in your wallet.</p>
                                    <p>{"This simulates the 'Resource Creates' method of creating an asset. For this method, the resource will define the metadata and send the create asset transaction to the blockchain. The asset will be sent to the user's wallet after they opt in."}</p>
                                    <div>
                                        <ResourceCreateAssetButton asset={resourceCreatesAssetId} setAsset={setResourceCreatesAssetId} />
                                    </div>
                                    {resourceCreatesAssetId && <div>
                                        <SignOptInButton asset={resourceCreatesAssetId} onConfirm={async () => setResourceCreatesOptedIn(true)} />
                                    </div>}
                                    {resourceCreatesAssetId && resourceCreatesOptedIn && <div>
                                        <ReceiveAssetFromResourceButton asset={resourceCreatesAssetId} updateAssets={updateOwnedAssets} />
                                    </div>}
                                </>
                            }
                        />
                        <Expandable
                            title='Generate New Asset (Smart Contract with Local Storage)'
                            content={
                                <>
                                    <p>Click below to request to receive a new asset from the authorizing resource. You will have to sign a transaction in your wallet.</p>
                                    <p>{"This simulates the 'Smart Contract Creates with Local Storage' method of creating an asset. For this method, the user must opt-in to the contract. Once they have opted-in the resource will call the smart contract with their asset details and user address. The smart contract creates the asset and stores the new asset's id in the user's local storage. Next the user opts-in to the asset and requests their asset from the smart contract. The smart contract uses the mapping in the user's local storage to find the asset created by it earlier and sends it to the user."}</p>
                                    <div>
                                        <ContractOptInButton contractId={contractId} onConfirm={async () => setSmartContractCreatesLocalOptedIn(true)} />
                                    </div>
                                    {smartContractCreatesLocalOptedIn && <div>
                                        <LocalContractCreatesForm contractId={contractId} setAssetId={setSmartContractCreatesLocalAssetId} />
                                    </div>}
                                    {smartContractCreatesLocalAssetId != '' && <div>
                                        <SignOptInButton asset={smartContractCreatesLocalAssetId} onConfirm={async () => setSmartContractCreatesLocalAssetOptedIn(true)} />
                                    </div>}
                                    {smartContractCreatesLocalAssetOptedIn && <div>
                                        <LocalContractRetrieveAssetButton contractId={contractId} assetId={smartContractCreatesLocalAssetId} updateAssets={updateOwnedAssets} />
                                    </div>}
                                </>
                            }
                        />
                    </>
                    }
                />

                <Step
                    title='Step 1: Choose Assets'
                    description='Here, users will specify the assets that they want to sign-in with. To be verified by Blockin, the user must own the requested asset in their wallet at the time of verification. Blockin verifies users through proof of ownership of an asset on-chain.'
                    content={<>
                        <Expandable
                            title='Add Owned Assets'
                            content={<AssetList assetIds={ownedAssets} addToChallenge={addAssetIdToChallenge} />}
                        />
                        <Expandable
                            title='Add Custom Asset IDs'
                            content={<div className='assetidinput'>
                                <input value={assetId} type="number" placeholder='Add Asset ID #' onChange={e => setAssetId(e.target.value)} />
                                <button
                                    onClick={async () => {
                                        await addAssetIdToChallenge(assetId);
                                        setAssetId('');
                                    }}
                                >
                                    Add to Challenge
                                </button>
                            </div>}
                        />
                        <div>
                            <h3><b>Asset IDs Added to the Challenge</b></h3>
                            <AssetIdList assetIds={assetIds} signInColor={signInColor} />
                            <button type='submit' onClick={clearChallenge}>Reset</button>
                        </div>
                    </>}
                />

                <Step
                    title='Step 2: Challenge is Generated'
                    description='The challenge below is created with the Blockin library. All information is customizable as long as it follows the Sign In with Ethereum Standard (EIP-4361).'
                    content={
                        <pre style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                            {challenge}
                        </pre>
                    }
                />

                <Step
                    title='Step 3: Sign Challenge with Your Wallet'
                    description=''
                    content={
                        <div style={{ marginBottom: 50, marginTop: 10 }}>
                            <SignChallengeButton assets={assetIds} cookieValue={assetIds[0] ? assetIds[0] : 'none'} challenge={challenge} />
                        </div>
                    }
                />
            </div>
        </Layout>
    )
}

export default Verification