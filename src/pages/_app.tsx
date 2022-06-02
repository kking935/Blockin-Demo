import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import WalletConnect from '@walletconnect/client'
import ConnectScreen from '../components/connectScreen';
import { ChainContext } from '../chain_handlers_frontend/ChainContext';
import { connect as algorandConnect } from '../chain_handlers_frontend/algorand/WalletConnect';
import { AlgorandContext } from '../chain_handlers_frontend/algorand/AlgorandContext';
import { PresetAsset, PresetUri, SignChallengeResponse } from 'blockin';

const App = ({ Component, pageProps }: AppProps) => {
    const [connector, setConnector] = useState<WalletConnect>()
    const [address, setAddress] = useState<string>('')
    const [chain, setChain] = useState<string>('Default');
    const [signChallenge, setSignChallenge] = useState<(challenge: string) => Promise<SignChallengeResponse>>(async () => { return {} });
    const [displayedAssets, setDisplayedAssets] = useState<PresetAsset[]>([]);
    const [displayedUris, setDisplayedUris] = useState<PresetUri[]>([]);
    const [currentChainInfo, setCurrentChainInfo] = useState<any>();
    const [ownedAssetIds, setOwnedAssetIds] = useState<string[]>([]);
    const [disconnect, setDisconnect] = useState<() => Promise<void>>(async () => { });
    const [connect, setConnect] = useState<() => Promise<void>>(async () => { });
    const [connected, setConnected] = useState<boolean>(false);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    return (
        <ChainContext.Provider value={{
            loggedIn,
            setLoggedIn,
            connected,
            setConnected,
            connect,
            setConnect,
            disconnect,
            setDisconnect,
            address,
            setAddress,
            chain,
            setChain,
            displayedAssets,
            setDisplayedAssets,
            displayedUris,
            setDisplayedUris,
            setSignChallenge,
            signChallenge,
            setCurrentChainInfo,
            currentChainInfo,
            ownedAssetIds,
            setOwnedAssetIds
        }}>
            <AlgorandContext.Provider value={{
                connector,
                setConnector,
            }}>
                <Component {...pageProps} />
            </AlgorandContext.Provider>
        </ChainContext.Provider >
    )
}

export default App
