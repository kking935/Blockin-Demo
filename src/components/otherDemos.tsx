/* eslint-disable react-hooks/exhaustive-deps */
import Layout from './layout'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { getChallenge, getAssets } from '../chain_handlers_frontend/backend_connectors';
import { NextPage } from 'next/types';
import { useChainContext } from '../chain_handlers_frontend/ChainContext';
import { getColorFromMetadata } from '../permissions/permissions';
import { SignChallengeButton } from './buttons/sign_challenge_button';
import { SignOptInButton } from './buttons/sign_opt_in_button';
import { ResourceCreateAssetButton } from './buttons/resource_create_asset_button';
import { AssetLink } from './assetLink';
import { ReceiveAssetFromResourceButton } from './buttons/resource_receive_asset_button';
import { UserCreatesForm } from './forms/user_create_asset_form';
import { LocalContractCreatesForm } from './forms/local_contract_create_asset_form';
import { Expandable } from './expandable';
import { Step } from './step';
import { AssetIdList, AssetList } from './assetList';
import ConnectScreen from './connectScreen';
import { ContractOptInButton } from './buttons/contract_opt_in_button';
import { LocalContractRetrieveAssetButton } from './buttons/local_contract_retrieve_button';

const SAMPLE_ASSET_ID = '86695725';

const contractId = process.env.NEXT_PUBLIC_LOCAL_CONTRACT_ID ?? "0";

const OtherDemos = () => {
    const { chain, address, connected } = useChainContext();
    const [challenge, setChallenge] = useState('');
    const [challengeParams, setChallengeParams] = useState({});

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
    }, [assetId, assetIds, chain, address]);

    useEffect(() => {
        updateOwnedAssets();
    }, [chain]);

    useEffect(() => {
        updateOwnedAssets();
    }, []);

    const updateChallenge = async () => {
        const blockinChallenge = await getChallenge(chain, address ? address : '0xabcdefghijklmnop', ['123456']);
        console.log("BLOCKIN CHALLENGE", blockinChallenge);
        setChallenge(blockinChallenge);
    }

    const updateOwnedAssets = async () => {
        // const address = CURRENT_CHAIN.startsWith('Algorand') ? connector?.accounts[0] : '0x9af0aa8d04F02329B11B2847527Ce1309acAE2EC';
        // // console.log(CURRENT_CHAIN.startsWith('Algorand'), CURRENT_CHAIN, address);
        // if (address) {
        //     const { assets, assetMap } = await getAssets(
        //         address,
        //         assetInfoMap,
        //         true
        //     );
        //     setAssetInfoMap(assetMap);
        //     setOwnedAssets(assets);
        // }
    }



    return (
        <>
            {/* <ConnectScreen /> */}
            <h2>Challenge Generation Demo</h2>
            <p>Challenges are generated using the EIP-4361 Sign-In with Ethereum interface. Blockin additionally supports specifying assets, such as NFTs, in the resources field by prefixing them with `Asset ID :`.</p>
            <p>The end-user will eventually sign this challenge message with their private key.</p>
            <p>A sample challenge is provided below: </p>
            <pre>{challenge}</pre>
            <hr />
            <h2>Asset Creation Demos</h2>
            <p>{"As explained in the Blockin paper, there are three different methods of creating authorization assets based on who creates them, each with their own respective pros and cons. Note that these assets don't have to be created using the Blockin library. However, all created assets will fall under one of the three categories."}</p>

            <Expandable
                title="User Creates"
                content={<>
                    <p>{"For 'User Creates', the user will create the asset, including the metadata, and send the asset creation transaction to the blockchain."}</p>
                    <p>{"This method has the advantage that the resource provider is not paying the gas fees for every transactin. Each user is paying their own gas fees."}</p>
                    <p>{"Note that although the user has complete freedom over the metadata, it should not be like this in reality. The authorizing resource can and should add additional validity checks enforcing that the metadata hash is well-formed for any specific user. We recommend following the guidelines defined in the Blockin paper."}</p>

                    <Expandable
                        // special={true}
                        title="Example: Dynamic Asset Metadata with User Creates"
                        content={<><p>{"Algorand allows 32 bytes for a metadata hash to be stored on-chain for each asset. These 32 bytes can be used in anyway that the authorizing resource would like to (encryption, hashes, plaintext, etc.)."}</p>
                            <p>{"We start with a valid HTML color name in plaintext such as 'red'. We then apply the following function to the plaintext to get the 32 bytes metadata hash: Base64(SHA256(plaintext))."}</p>
                            <p>{"If we perform this function on 'red', the output is 'sfUaUR8doM00i4+FmNsy5hy5Y+X8aeK0FIW/mVkO11o='"}</p>
                            <p>{"If you "}<AssetLink assetId={SAMPLE_ASSET_ID} text='click here' />{" and go to the 'Technical Information' tab, you can see the metadata hash stored on-chain for this example asset is 'sfUaUR8doM00i4+FmNsy5hy5Y+X8aeK0FIW/mVkO11o='."}</p>
                            <p>{"Whenever a user requests to sign in with an asset using Blockin, the authorizing resource can use this metadata hash to grant role-based privileges. For example, users that sign in with the above asset can be placed on the red team."}</p>
                        </>}
                    />
                    <h4>User Demo</h4>
                    {chain === 'Algorand Testnet' && connected ? <>
                        <p>Click below to create a new asset. You may specify a metadata color in the input box below. You will have to sign the creation transaction in your wallet.</p>

                        <UserCreatesForm updateOwnedAssets={updateOwnedAssets} />
                    </> : <><p>Switch your chain to Algorand Testnet in the site header and connect a wallet to participate in the demo.</p></>}
                </>}
            />

            <Expandable
                title='Resource Creates'
                content={
                    <>
                        <p>{"For this method, the resource will define the metadata and send the asset creation transaction to the blockchain. The asset will then be sent to the user's wallet."}</p>

                        <h4>Resource Demo (Algorand Testnet)</h4>
                        {chain === 'Algorand Testnet' && connected ? <>
                            <p>Click below to request to receive a new asset from the authorizing resource. You will have to sign a transaction in your wallet.</p>

                            <div>
                                <ResourceCreateAssetButton asset={resourceCreatesAssetId} setAsset={setResourceCreatesAssetId} />
                            </div>
                            {resourceCreatesAssetId && <div>
                                <SignOptInButton asset={resourceCreatesAssetId} onConfirm={async () => setResourceCreatesOptedIn(true)} />
                            </div>}
                            {resourceCreatesAssetId && resourceCreatesOptedIn && <div>
                                <ReceiveAssetFromResourceButton asset={resourceCreatesAssetId} updateAssets={updateOwnedAssets} />
                            </div>}
                        </> : <><p>Switch your chain to Algorand Testnet in the site header and connect a wallet to participate in the demo.</p></>}
                    </>
                }
            />
            <Expandable
                title='Smart Contract Creates'
                content={
                    <>
                        <p>{"For this method, a smart contract will define the metadata and send the asset creation transaction to the blockchain. The asset will then be sent to the user's wallet via the smart contract."}</p>
                        <h4>Smart Contract Demo (Algorand Testnet)</h4>
                        {chain === 'Algorand Testnet' && connected ? <>
                            <p>Click below to request to receive a new asset from the authorizing resource. You will have to sign a transaction in your wallet.</p>

                            <p>{"For this method, the user must opt-in to the contract. Once they have opted-in the resource will call the smart contract with their asset details and user address. The smart contract creates the asset and stores the new asset's id in the user's local storage. Next the user opts-in to the asset and requests their asset from the smart contract. The smart contract uses the mapping in the user's local storage to find the asset created by it earlier and sends it to the user."}</p>

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
                        </> : <><p>Switch your chain to Algorand Testnet in the site header and connect a wallet to participate in the demo.</p></>}

                    </>
                }
            />

            <br />
            {/* <Step
                title='Steps 1-4 Implemented: Example Sign-In Process'
                description='At the header of this page, we show an implementation of steps 1-4 for our demo site. As explained above, we will be using different banner designs to showcase different role-based access privileges.'
                content={<>
                    <p>{'If you are connected via Pera Wallet and Algorand, you may select one of these chains, and the site will send you a valid sign-in request to your wallet. Or else, we have provided a "Simulated" experience for you that will successfully sign the challenge on your behalf.'}</p>
                    <p>*Note that the assets generated in Step 0 are for Testnet only.</p>
                    <div style={{ marginBottom: 50, marginTop: 10 }}>
                    </div>
                </>
                }
            /> */}
        </>
    )
}

export default OtherDemos