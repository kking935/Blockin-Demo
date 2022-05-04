import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import WalletConnect from '@walletconnect/client'
import ConnectScreen from '../components/connectScreen';
import { WalletContext } from '../contexts/WalletContext';
import { AlgoDriver, setChainDriver } from 'blockin';

const App = ({ Component, pageProps }: AppProps) => {
    const [connector, setConnector] = useState<WalletConnect>()
    setChainDriver(new AlgoDriver(process.env.ALGO_API_KEY ? process.env.ALGO_API_KEY : ''))

    useEffect(() => {
        console.log('refreshing page')
    }, [connector])

    return (
        <WalletContext.Provider value={{
            connector,
            setConnector
        }}>
            <ConnectScreen />
            <Component {...pageProps} />
        </WalletContext.Provider>
    )
}

export default App
