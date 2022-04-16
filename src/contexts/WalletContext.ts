import WalletConnect from '@walletconnect/client';
import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

export type WalletContextType = {
    connector?: WalletConnect,
    setConnector: Dispatch<SetStateAction<WalletConnect | undefined>>;
}

export const WalletContext = createContext<WalletContextType>({
    connector: undefined,
    setConnector: () => {}
})

export const useWalletContext = () => useContext(WalletContext)  