import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import Web3Modal from "web3modal";


export type EthereumContextType = {
    web3Modal?: Web3Modal,
    setWeb3Modal: Dispatch<SetStateAction<Web3Modal | undefined>>;
}


export const EthereumContext = createContext<EthereumContextType>({
    web3Modal: undefined,
    setWeb3Modal: () => { },
})

export const useEthereumContext = () => useContext(EthereumContext)  