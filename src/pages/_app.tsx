import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import WalletConnect from '@walletconnect/client'
import ConnectScreen from '../components/connectScreen';
import { WalletContext } from '../contexts/WalletContext';
import { connect } from '../WalletConnect';

const App = ({ Component, pageProps }: AppProps) => {
    const [connector, setConnector] = useState<WalletConnect>()
    const [address, setAddress] = useState('')

    useEffect(() => {
        connect(setConnector, setAddress)
    }, [])

    return (
        <WalletContext.Provider value={{
            connector,
            setConnector,
            address,
            setAddress
        }}>
            <Component {...pageProps} />
        </WalletContext.Provider>
    )
}

export default App
