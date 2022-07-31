/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { useChainContext } from "../../chain_handlers_frontend/ChainContext"
import { getAssets, getChallenge, verifyChallengeOnBackend } from "../../chain_handlers_frontend/backend_connectors"
import { BlockinUIDisplay } from 'blockin/dist/ui';
import { constructChallengeObjectFromString, ChallengeParams, SupportedChainMetadata } from 'blockin';
import { signChallengeEth } from "../../chain_handlers_frontend/ethereum/sign_challenge";
import { connect as algorandConnect } from "../../chain_handlers_frontend/algorand/WalletConnect";
import { useAlgorandContext } from "../../chain_handlers_frontend/algorand/AlgorandContext";
import { signChallengeAlgo } from "../../chain_handlers_frontend/algorand/sign_challenge";
import Blockies from 'react-blockies';
import { ethers } from "ethers";
import { useEthereumContext } from "../../chain_handlers_frontend/ethereum/EthereumContext";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

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
        setDisplayedResources,
        selectedChainInfo,
        setSelectedChainInfo,
        setSignChallenge,
        setOwnedAssetIds,
        displayedResources,
        chain,
        setChain,
        setAddress,
        connected,
        setConnected,
        loggedIn,
        setLoggedIn
    } = useChainContext();
    const { web3Modal, setWeb3Modal } = useEthereumContext();
    const [challengeString, setChallengeString] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies(['blockedin', 'stripes', 'gradient']);
    const [assetsDisplayed, setAssetsDisplayed] = useState(assets ? assets.map((elem: any) => {
        // console.log(elem);
        return { assetId: elem['asset-id'], name: `Algorand Testnet Asset ID: ${elem['asset-id']}`, frozen: false, defaultSelected: false, description: `${elem['color']} Banner` }
    }) : []);
    const [nonce, setNonce] = useState('0x123456789');

    useEffect(() => {
        setAssetsDisplayed(assets.map((elem: any) => {
            // console.log(elem);
            return { assetId: elem['asset-id'], name: `Algorand Testnet Asset ID: ${elem['asset-id']}`, frozen: false, defaultSelected: false, description: `${elem['color']} Banner` }
        }));
    }, [assets]);

    useEffect(() => {
        // console.log('INITIAL USE EFFECT', chain)
        handleUpdateChain({ name: chain });
    }, [])


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
                    if (resource === 'https://blockin.com/admin') {
                        setCookie('stripes', true, { 'path': '/' })
                    }
                    if (resource === 'https://blockin.com/manager') {
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


    const handleUpdateChain = async (newChainProps: SupportedChainMetadata) => {
        console.log(newChainProps)
        setConnected(false);
        console.log(newChainProps.name);
        setAddress('');

        if (newChainProps.name && newChainProps.name.startsWith('Algorand')) {
            setSelectedChainInfo({});
            setChain(newChainProps.name);
            const connectFunction = () => {
                return async () => {
                    await algorandConnect(setConnector, setAddress, setConnected, setOwnedAssetIds);
                }
            }
            setConnect(connectFunction);
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
            setDisplayedResources([])
        } else if (newChainProps.name === 'Simulated') {
            setSelectedChainInfo({});
            setChain(newChainProps.name);
            //TODO: I know this isn't the right way to do this but it works
            setConnect(() => async () => {
                setAddress('0x123456789123456789123456789123456789')
                setConnected(true);
            });
            setDisconnect(() => async () => {
                await logout();
                setAddress('');
                setConnected(false);
            });
            setSignChallenge(() => handleSignChallengeSuccess);
            setDisplayedResources([])
            setOwnedAssetIds([]);
        } else {
            // console.log('SETTING TO ETHEREUM', chain);
            setSelectedChainInfo({
                getNameForAddress: async (address: string) => {
                    // console.log("ENSSSSS");
                    if (address) {
                        console.log("ATTEMPTING TO RESOLVE ENS NAME...")
                        const ensAddress = await ethers.getDefaultProvider('homestead', { quorum: 1 }).lookupAddress(address);
                        if (ensAddress) return ensAddress;
                    }
                    return undefined;
                }
            });

            //TODO: I know this isn't the right way to do this but it works
            const connectFunction = () => {
                const providerOptions = {
                    // Example with WalletConnect provider
                    walletconnect: {
                        package: WalletConnectProvider,
                        options: {
                            infuraId: "27e484dcd9e3efcfd25a83a78777cdf1"
                        }
                    }
                };

                const web3ModalInstance = web3Modal ? web3Modal : new Web3Modal({
                    network: "mainnet", // optional
                    cacheProvider: false, // optional
                    providerOptions // required
                });
                setWeb3Modal(web3ModalInstance);

                return async () => {
                    const handleConnect = async () => {
                        web3ModalInstance.clearCachedProvider();

                        const instance = await web3ModalInstance.connect();
                        const provider = new ethers.providers.Web3Provider(instance);
                        const signer = provider.getSigner();
                        let chainId = '0x1';
                        let addParams = {};
                        if (newChainProps.name === 'Polygon') {


                            chainId = '0x89';
                            addParams = {
                                chainId: '0x89',
                                chainName: "Polygon",
                                rpcUrls: ["https://polygon-rpc.com/"],
                                blockExplorerUrls: ["https://polygonscan.com/"],
                            }
                        } else if (newChainProps.name === 'BSC' || newChainProps.name === 'Binance Smart Chain') {
                            chainId = '0x38';
                            addParams = {
                                "chainId": "0x38", // 56 in decimal
                                "chainName": "Smart Chain",
                                "rpcUrls": [
                                    "https://bsc-dataseed.binance.org"
                                ],
                                "nativeCurrency": {
                                    "name": "Binance Coin",
                                    "symbol": "BNB",
                                    "decimals": 18
                                },
                                "blockExplorerUrls": [
                                    "https://bscscan.com"
                                ]
                            }
                        } else if (newChainProps.name === 'Avalanche') {

                            chainId = '0xA86A'
                            addParams = {
                                chainId: "0xA86A",
                                chainName: "Avalanche Mainnet C-Chain",
                                nativeCurrency: {
                                    name: "Avalanche",
                                    symbol: "AVAX",
                                    decimals: 18,
                                },
                                rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
                                blockExplorerUrls: ["https://snowtrace.io/"],
                            }
                        }
                        console.log(chainId, addParams);
                        try {
                            await window.ethereum.request({
                                method: "wallet_switchEthereumChain",
                                params: [{ chainId: chainId }],
                            });
                        } catch (switchError: any) {
                            // This error code indicates that the chain has not been added to MetaMask.
                            if (switchError.code === 4902) {
                                try {
                                    await window.ethereum.request({
                                        method: "wallet_addEthereumChain",
                                        params: [
                                            addParams
                                        ],
                                    });
                                } catch (addError) {
                                    throw addError;
                                }
                            }
                        }
                        setConnected(true);
                        setAddress(await signer.getAddress());
                        const assetIds = [];
                        //TODO: add asset lookups for other chains
                        if (newChainProps.name === 'Ethereum') {
                            const returnedAssets = await getAssets('Ethereum', await signer.getAddress(), {}, false);
                            // console.log("ASFHJKASDFH", assets);

                            for (const asset of returnedAssets?.assets) {
                                assetIds.push(asset['token_address']);
                            }
                        }
                        setOwnedAssetIds(assetIds);

                    }
                    await handleConnect();
                }
            }
            setChain(newChainProps.name ?? '');
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
            setDisplayedResources([]);


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
    let loggedInDetails = 'Normal User';
    if (cookies['stripes']) {
        loggedInDetails = 'Admin';
    } else if (cookies['gradient']) {
        loggedInDetails = 'Manager';
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
                <BlockinUIDisplay
                    connected={connected}
                    address={address}
                    connect={async () => {
                        connect()
                    }}
                    disconnect={async () => {
                        disconnect()
                    }}
                    chainOptions={[
                        {
                            name: 'Simulated',
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
                        {
                            name: 'Polygon',
                        },
                        { name: 'BSC' },
                        { name: 'Avalanche' }
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
                    loggedInDetails={loggedInDetails}
                    logout={async () => {
                        await logout();
                        setLoggedIn(false);
                    }}
                    selectedChainName={chain}
                    selectedChainInfo={selectedChainInfo}
                    displayedResources={[{
                        isAsset: true,
                        assetIdOrUriString: '0x1234567890',
                        name: 'Premium Features',
                        defaultSelected: false,
                        frozen: false,
                        description: 'This asset (NFT) represents access to this site\'s premium features. This is just here for demo purposes. You will NOT be verified by Blockin if this is selected because you do not actually own this asset.'
                    },
                    {
                        isAsset: false,
                        assetIdOrUriString: 'https://blockin.com/admin',
                        name: 'Administrator',
                        defaultSelected: false,
                        frozen: false,
                        description: 'Anything can be added as a resource to sign-in requests, not just assets. If selected, this site will verify that you are an "administrator", and if so, you will get "administrator" privileges.'
                    },
                    // {
                    //     isAsset: false,
                    //     assetIdOrUriString: 'https://blockin.com/manager',
                    //     name: 'Manager (Red)',
                    //     defaultSelected: false,
                    //     frozen: false,
                    //     description: 'If selected, this site will verify that you are a "manager", and if so, you will get "manager" privileges and see a red banner on-screen.'
                    // },
                    {
                        isAsset: false,
                        assetIdOrUriString: 'https://blockin.com/standard',
                        name: 'Normal User',
                        defaultSelected: true,
                        frozen: true,
                        description: 'This site always requires you to sign-in with at least the minimum standard user access, so this resource is selected and locked.'
                    }]}
                    signAndVerifyChallenge={async (challenge: string) => {
                        const signChallengeResponse = await handleSignChallenge(challenge);
                        if (!signChallengeResponse.originalBytes || !signChallengeResponse.signatureBytes) {
                            return { success: false, message: `${signChallengeResponse.message}` };
                        }

                        const verifyChallengeResponse = await handleVerifyChallenge(
                            signChallengeResponse.originalBytes,
                            signChallengeResponse.signatureBytes,
                            constructChallengeObjectFromString(challenge)
                        );
                        return verifyChallengeResponse;
                    }}
                    canAddCustomAssets={true}
                    customAddHelpDisplay={
                        <>
                            <>Try experimenting with adding custom assets that you do and do not own below.</>
                            <br /><br />
                            <>For EVM chains, the asset ID # is the contract address. For Algorand, it is the Asset ID.</>
                            {ownedAssetIds.length > 0 && <> For convenience, we have provided you with a list of asset IDs that you own in the connected wallet:<pre>{` ${ownedAssetIds ? ownedAssetIds.map((val, idx) => {
                                return `${idx + 1}) ${val}\n`
                            }).join(' ') : 'None'}`}</pre></>}
                        </>
                    }

                />

            }
        </div>
    </>;
}