import WalletConnect from '@walletconnect/client';
import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

export type WalletContextType = {
    connector?: WalletConnect,
    setConnector: Dispatch<SetStateAction<WalletConnect | undefined>>;
    address: string,
    setAddress: Dispatch<SetStateAction<string>>;
}

export const WalletContext = createContext<WalletContextType>({
    connector: undefined,
    setConnector: () => {},
    address: '',
    setAddress: () => {}
})

export const useWalletContext = () => useContext(WalletContext)  