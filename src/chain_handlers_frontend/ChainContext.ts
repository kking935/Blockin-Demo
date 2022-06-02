import { PresetAsset, PresetUri, SignChallengeResponse } from 'blockin';
import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

export type ChainContextType = {
    connected: boolean,
    setConnected: Dispatch<SetStateAction<boolean>>,

    loggedIn: boolean,
    setLoggedIn: Dispatch<SetStateAction<boolean>>,

    connect: () => {},
    setConnect: Dispatch<SetStateAction<() => Promise<void>>>,

    disconnect: () => {},
    setDisconnect: Dispatch<SetStateAction<() => Promise<void>>>,

    address: string,
    setAddress: Dispatch<SetStateAction<string>>,

    signChallenge: (challenge: string) => Promise<SignChallengeResponse>,
    setSignChallenge: Dispatch<SetStateAction<(challenge: string) => Promise<SignChallengeResponse>>>,

    ownedAssetIds: string[],
    setOwnedAssetIds: Dispatch<SetStateAction<string[]>>,

    //Should be consistent with the ChainSelect Props for the UI button
    chain: string,
    setChain: Dispatch<SetStateAction<string>>,

    displayedAssets: PresetAsset[],
    setDisplayedAssets: Dispatch<SetStateAction<PresetAsset[]>>,

    displayedUris: PresetUri[],
    setDisplayedUris: Dispatch<SetStateAction<PresetUri[]>>,

    currentChainInfo?: any | undefined,
    setCurrentChainInfo?: Dispatch<SetStateAction<(challenge: string) => Promise<any | undefined>>>,
}

export const ChainContext = createContext<ChainContextType>({
    connected: false,
    setConnected: () => { },
    loggedIn: false,
    setLoggedIn: () => { },
    connect: async () => { },
    setConnect: () => { },
    disconnect: async () => { },
    setDisconnect: () => { },
    address: '',
    setAddress: () => { },
    signChallenge: async () => { return {} },
    setSignChallenge: () => { },
    chain: 'Ethereum',
    setChain: () => { },
    ownedAssetIds: [],
    setOwnedAssetIds: () => { },
    displayedAssets: [],
    displayedUris: [],
    setDisplayedAssets: () => { },
    setDisplayedUris: () => { },
});

export const useChainContext = () => useContext(ChainContext);