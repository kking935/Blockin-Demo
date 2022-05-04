import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import WalletConnect from '@walletconnect/client'
import ConnectScreen from '../components/connectScreen';
import { WalletContext } from '../contexts/WalletContext';

const App = ({ Component, pageProps }: AppProps) => {
    const [connector, setConnector] = useState<WalletConnect>()


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
