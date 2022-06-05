import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import WalletConnect from '@walletconnect/client'
import ConnectScreen from '../components/connectScreen';
import { ChainContext, SignChallengeResponse } from '../chain_handlers_frontend/ChainContext';
import { connect as algorandConnect } from '../chain_handlers_frontend/algorand/WalletConnect';
import { AlgorandContext } from '../chain_handlers_frontend/algorand/AlgorandContext';
import { PresetResource } from 'blockin';
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { EthereumContext } from '../chain_handlers_frontend/ethereum/EthereumContext';


const App = ({ Component, pageProps }: AppProps) => {
    const [web3Modal, setWeb3Modal] = useState<Web3Modal>();
    const [connector, setConnector] = useState<WalletConnect>()
    const [address, setAddress] = useState<string>('')
    const [chain, setChain] = useState<string>('Simulated');
    const [signChallenge, setSignChallenge] = useState<(challenge: string) => Promise<SignChallengeResponse>>(async () => { return {} });
    const [displayedResources, setDisplayedResources] = useState<PresetResource[]>([]);
    const [selectedChainInfo, setSelectedChainInfo] = useState<any>();
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
            displayedResources,
            setDisplayedResources,
            setSignChallenge,
            signChallenge,
            setSelectedChainInfo,
            selectedChainInfo,
            ownedAssetIds,
            setOwnedAssetIds
        }}>
            <EthereumContext.Provider value={{
                web3Modal, setWeb3Modal
            }}>
                <AlgorandContext.Provider value={{
                    connector,
                    setConnector,
                }}>
                    <Component {...pageProps} />
                </AlgorandContext.Provider>
            </EthereumContext.Provider>
        </ChainContext.Provider >
    )
}

export default App
