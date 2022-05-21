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
import { ChainSelect, SignInWithBlockinButton } from 'blockin/dist/ui';

const UserPerspectives: NextPage = () => {
    const [netflixChainProps, setNetflixChainProps] = useState({ name: 'Ethereum' })
    const [facebookChainProps, setFacebookChainProps] = useState({ name: 'Ethereum' })
    const [espnChainProps, setEspnChainProps] = useState({ name: 'Ethereum' })

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
            <h1>User Perspectives of Blockin!</h1>
            <p>{"It will be very simple for a normal, non-technical user to use Blockin! The only difference they will see when browsing a website is the existing sign-in buttons will be replaced by the buttons shown below."}</p>
            <p>{"*Note that everything below is simulated for tthe demo's convenience."}</p>


            <Step
                title='Netflix'
                description=''
                content={
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <ChainSelect chains={[{ name: 'Ethereum' }, { name: 'Algorand Mainnet' }, { name: 'Blockin Chain' }]} updateChain={async (chainProps) => { setNetflixChainProps(chainProps) }} />
                        <SignInWithBlockinButton
                            challengeParams={
                                {
                                    domain: "https://netflix.com",
                                    uri: "https://netflix.com",
                                    nonce: 'netflixnonceabc7623178',
                                    statement: 'Sign in to Netflix using Blockin!',
                                    address: `0x123456789abcdefghijklmnop`
                                }
                            }
                            currentChain={netflixChainProps.name}
                            displayedUris={[]}
                            displayedAssets={[
                                {
                                    assetId: '123456',
                                    name: 'Family Plan',
                                    frozen: false,
                                    defaultSelected: false,
                                    description: 'Select this asset to sign-in with the family plan. Blockin will verify and see if you own this family plan asset on the blockchain!'
                                },
                                {
                                    assetId: '1234567',
                                    name: 'Standard Plan',
                                    frozen: false,
                                    defaultSelected: false,
                                    description: 'Select this asset to sign-in with the family plan. Blockin will verify and see if you own this standard plan asset on the blockchain!'
                                }
                            ]}
                            signChallenge={handleSignChallengeSuccess}
                            verifyChallengeOnBackend={getVerifyChallengeSuccess}
                        />
                    </div>
                }
            />

            <Step
                title='Facebook'
                description=''
                content={
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <ChainSelect chains={[{ name: 'Ethereum' }, { name: 'Algorand Mainnet' }, { name: 'Blockin Chain' }]} updateChain={async (chainProps) => { setFacebookChainProps(chainProps) }} />
                        <SignInWithBlockinButton
                            challengeParams={
                                {
                                    domain: "https://facebook.com",
                                    uri: "https://facebook.com",
                                    nonce: 'facebooknonceabc7623178',
                                    statement: 'Sign in to Facebook using Blockin!',
                                    address: `0x123456789abcdefghijklmnop`
                                }
                            }
                            currentChain={facebookChainProps.name}
                            displayedUris={[]}
                            displayedAssets={[]}
                            signChallenge={handleSignChallengeSuccess}
                            verifyChallengeOnBackend={getVerifyChallengeSuccess}
                        />
                    </div>
                }
            />

            <Step
                title='ESPN'
                description=''
                content={
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <ChainSelect chains={[{ name: 'Ethereum' }, { name: 'Algorand Mainnet' }, { name: 'Blockin Chain' }]} updateChain={async (chainProps) => { setEspnChainProps(chainProps) }} />
                        <SignInWithBlockinButton
                            challengeParams={
                                {
                                    domain: "https://espn.com",
                                    uri: "https://espn.com",
                                    nonce: 'espnnonceabc7623178',
                                    statement: 'Sign in to ESPN using Blockin! You may select between the standard access plan and the ESPN+ plan below.',
                                    address: `0x123456789abcdefghijklmnop`
                                }
                            }
                            currentChain={espnChainProps.name}
                            displayedUris={[]}
                            displayedAssets={[
                                {
                                    assetId: '123456',
                                    name: 'Standard Access',
                                    frozen: false,
                                    defaultSelected: false,
                                    description: 'Select this asset to sign-in with the standard access plan. Blockin will verify and see if you own this standard plan asset on the blockchain!'
                                },
                                {
                                    assetId: '1234567',
                                    name: 'ESPN+ Access',
                                    frozen: false,
                                    defaultSelected: false,
                                    description: 'Select this asset to sign-in with the ESPN+ plan. Blockin will verify and see if you own this ESPN+ plan asset on the blockchain!'
                                }
                            ]}
                            signChallenge={handleSignChallengeSuccess}
                            verifyChallengeOnBackend={getVerifyChallengeSuccess}
                        />
                    </div>
                }
            />
        </Layout >
    )
}

export default UserPerspectives