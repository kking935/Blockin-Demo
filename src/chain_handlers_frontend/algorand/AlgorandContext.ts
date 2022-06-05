import WalletConnect from '@walletconnect/client';
import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

export type AlgorandContextType = {
    connector?: WalletConnect,
    setConnector: Dispatch<SetStateAction<WalletConnect | undefined>>;
}

export const AlgorandContext = createContext<AlgorandContextType>({
    connector: undefined,
    setConnector: () => { },
})

export const useAlgorandContext = () => useContext(AlgorandContext)  