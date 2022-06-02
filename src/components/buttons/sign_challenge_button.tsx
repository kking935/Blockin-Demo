/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { useChainContext } from "../../chain_handlers_frontend/ChainContext"
import { getAssets, getChallenge, verifyChallengeOnBackend } from "../../chain_handlers_frontend/backend_connectors"
import { ChainSelect, SignInWithBlockinButton } from 'blockin/dist/ui';
import { constructChallengeObjectFromString, ChainProps, ChallengeParams, SupportedChain } from 'blockin';
import { signChallengeEth } from "../../chain_handlers_frontend/ethereum/sign_challenge";
import { connect as algorandConnect } from "../../chain_handlers_frontend/algorand/WalletConnect";
import { useAlgorandContext } from "../../chain_handlers_frontend/algorand/AlgorandContext";
import { signChallengeAlgo } from "../../chain_handlers_frontend/algorand/sign_challenge";

const loadingMessage = <>
    <p>Go to your wallet and accept the challenge request...</p>
</>

const successMessage = <>
    <p>Challenge succeeded!</p>
    <p>You are now authenticated.</p>
    <p>If you specified a banner privilege, you should see the banner at the top of this page change!</p>
</>

const failureMessage = <>
    <p>Challenge failed!</p>
    <p>You are NOT authenticated</p>
</>

declare var window: any;

export const SignChallengeButton = ({ challengeParams, cookieValue, assets }: { challengeParams: string, cookieValue: string, assets: string[] }) => {
    const [userIsSigningChallenge, setUserIsSigningChallenge] = useState(false);
    const [displayMessage, setDisplayMessage] = useState(loadingMessage);
    const {
        connector,
        setConnector
    } = useAlgorandContext();
    const {
        connect,
        disconnect,
        ownedAssetIds,
        address,
        setConnect,
        signChallenge,
        setDisconnect,
        setDisplayedAssets,
        setDisplayedUris,
        setCurrentChainInfo,
        setSignChallenge,
        setOwnedAssetIds,
        displayedAssets,
        displayedUris,
        chain,
        setChain,
        setAddress,
        connected,
        setConnected,
        loggedIn,
        setLoggedIn
    } = useChainContext();
    const [challengeString, setChallengeString] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies(['blockedin', 'stripes', 'gradient']);
    const [assetsDisplayed, setAssetsDisplayed] = useState(assets ? assets.map((elem: any) => {
        console.log(elem);
        return { assetId: elem['asset-id'], name: `Algorand Testnet Asset ID: ${elem['asset-id']}`, frozen: false, defaultSelected: false, description: `${elem['color']} Banner` }
    }) : []);
    const [nonce, setNonce] = useState('0x123456789');

    useEffect(() => {
        setAssetsDisplayed(assets.map((elem: any) => {
            console.log(elem);
            return { assetId: elem['asset-id'], name: `Algorand Testnet Asset ID: ${elem['asset-id']}`, frozen: false, defaultSelected: false, description: `${elem['color']} Banner` }
        }));
    }, [assets]);


    const handleSignChallenge = async (challenge: string) => {
        setUserIsSigningChallenge(true);
        setDisplayMessage(loadingMessage);
        setChallengeString(challenge);
        console.log("CHALLENGE STRING", challenge);

        if (chain === 'Simulated') {
            return { signatureBytes: new Uint8Array(32), originalBytes: new Uint8Array(32) }
        }

        const response = await signChallenge(challenge);
        return response;

    }

    const handleVerifyChallenge = async (originalBytes: Uint8Array, signatureBytes: Uint8Array, challengeObj: ChallengeParams) => {
        console.log("TEST", originalBytes, signatureBytes, challengeObj);
        const verificationResponse = chain !== 'Simulated' ? await verifyChallengeOnBackend(chain, originalBytes, signatureBytes) : { verified: true, message: 'Successfully verified!' };
        console.log(verificationResponse, "REASDJAHK");
        if (!verificationResponse.verified) {
            setDisplayMessage(failureMessage);
            setUserIsSigningChallenge(false);
            return { success: false, message: `${verificationResponse.message}` }
        }
        else {
            setDisplayMessage(successMessage);
            setCookie('blockedin', cookieValue, { 'path': '/' });

            if (challengeObj.resources) {
                console.log(challengeObj);
                for (const resource of challengeObj.resources) {
                    console.log(resource);
                    if (resource === 'https://blockin.com/blue') {
                        setCookie('stripes', true, { 'path': '/' })
                    }
                    if (resource === 'https://blockin.com/red') {
                        setCookie('gradient', true, { 'path': '/' })
                    }
                }
            }
        }

        alert(verificationResponse.message);
        setLoggedIn(true);
        return {
            success: true, message: `${verificationResponse.message}`
        }
    }


    const handleUpdateChain = async (newChainProps: SupportedChain) => {
        setConnected(false);
        console.log(newChainProps.name);
        setAddress('');
        if (newChainProps.name === 'Ethereum') {
            setChain('Ethereum');
            //TODO: I know this isn't the right way to do this but it works
            const connectFunction = () => {
                return async () => {
                    console.log("asfjhaksdfhjk");
                    let accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    console.log(accounts);
                    if (accounts[0]) {
                        setAddress(accounts[0]);
                        setConnected(true);
                    }
                }
            }
            setConnect(connectFunction);
            setDisconnect(() => {
                return async () => {
                    await logout();
                    setAddress('');
                    setConnected(false);
                }
            });
            setSignChallenge(() => async (challenge: string) => {
                return signChallengeEth(challenge);
            });
            setDisplayedAssets([]);
            setDisplayedUris([]);
            setOwnedAssetIds(['TODO: 123456', '31278351256']);
        } else if (newChainProps.name.startsWith('Algorand')) {

            setChain(newChainProps.name);
            //TODO: I know this isn't the right way to do this but it works
            setConnect(() => async () => {
                algorandConnect(setConnector, setAddress, setConnected);
            });
            setDisconnect(() => async () => {
                await logout();
                await connector?.killSession({ message: 'bye' })
                connector?.rejectSession({ message: 'bye' })
                setConnector(undefined)
                setAddress('')
                setConnected(false);
            });
            setSignChallenge(() => async (challenge: string) => {
                if (connector) return signChallengeAlgo(connector, challenge, newChainProps.name === 'Algorand Testnet');
                else throw 'Error signing challenge'
            });
            setDisplayedAssets([]);
            setDisplayedUris([]);
            setOwnedAssetIds(['TODO: 56789', '123472387']);
        } else if (newChainProps.name === 'Simulated') {
            setChain(newChainProps.name);
            //TODO: I know this isn't the right way to do this but it works
            setConnect(() => async () => {
                setAddress('0x123456789')
                setConnected(true);
            });
            setDisconnect(() => async () => {
                await logout();
                setAddress('');
                setConnected(false);
            });
            setSignChallenge(() => handleSignChallengeSuccess);
            setDisplayedAssets([]);
            setDisplayedUris([]);
            setOwnedAssetIds([]);
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

    const logout = async () => {
        removeCookie('blockedin', { 'path': '/' });
        removeCookie('stripes', { 'path': '/' });
        removeCookie('gradient', { 'path': '/' });
        setLoggedIn(false);
    }

    useEffect(() => {
        updateNonce();
    }, [chain, address]);


    const updateNonce = async () => {
        if (address) {
            const blockinChallenge = await getChallenge(chain, address, []);
            const challengeObj = constructChallengeObjectFromString(blockinChallenge)
            setNonce(challengeObj.nonce);
        }
    }

    return <>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {/* <ChainSelect
                chains={[
                    {
                        name: 'Simulated'
                    },
                    {
                        name: 'Ethereum'
                    },
                    {
                        name: 'Algorand Testnet',
                    },
                    {
                        name: 'Algorand Mainnet',
                    },
                ]}
                updateChain={handleUpdateChain}
            /> */}
            {
                <SignInWithBlockinButton
                    connected={connected}
                    connect={async () => {
                        connect()
                    }}
                    disconnect={async () => {
                        disconnect()
                    }}
                    chainOptions={[
                        {
                            name: 'Simulated'
                        },
                        {
                            name: 'Ethereum'
                        },
                        {
                            name: 'Algorand Testnet',
                        },
                        {
                            name: 'Algorand Mainnet',
                        },
                    ]}
                    onChainUpdate={handleUpdateChain}
                    challengeParams={{
                        domain: 'https://blockin.com',
                        statement: 'Sign in to this website via Blockin. You will remain signed in until you terminate your browser session.',
                        address: address,
                        uri: 'https://blockin.com/login',
                        nonce: nonce,
                        expirationDate: '2022-12-22T18:19:55.901Z',
                        notBefore: undefined
                    }}
                    loggedIn={loggedIn}
                    logout={async () => {
                        await logout();
                        setLoggedIn(false);
                    }}
                    currentChain={chain}
                    displayedAssets={[{
                        assetId: '0xabc123xyz456',
                        name: 'Sample Asset',
                        defaultSelected: false,
                        frozen: false,
                        description: 'This asset is just displayed for demo purposes to show that assets can be used in sign-in requests. You will NOT be verified by Blockin if this is selected because you do not actually own this asset. You can experiment with adding custom assets that you do own below.'
                    }]}
                    displayedUris={[{
                        uri: 'https://blockin.com/blue',
                        name: 'Blue Banner',
                        defaultSelected: false,
                        frozen: false,
                        description: 'If selected, you will see a blue banner at the top of the page upon signing-in. '
                    },
                    {
                        uri: 'https://blockin.com/red',
                        name: 'Red Banner',
                        defaultSelected: false,
                        frozen: false,
                        description: 'If selected, you will see a red banner at the top of the page upon signing-in. '
                    }]}
                    signChallenge={handleSignChallenge}
                    verifyChallengeOnBackend={handleVerifyChallenge}
                    canAddCustomAssets={true}
                    customAddResourcesMessage={`For convenience, we have provided you with a list of asset IDs that you own in the connected wallet: ${ownedAssetIds ? ownedAssetIds.toString() : 'None'}`}
                />

            }
        </div>
        <div style={{ textAlign: 'center' }}>
            Address: {address ? address : 'None'}
        </div>

        {/* {userIsSigningChallenge && displayMessage} */}
    </>;
}