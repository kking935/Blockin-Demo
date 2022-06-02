import algosdk from 'algosdk';
import AlgoDriver from 'blockin-algo-driver';
import EthDriver from 'blockin-eth-driver';

export const passphrase = process.env.RESOURCE_PASSPHRASE ? process.env.RESOURCE_PASSPHRASE : '';
export const myAccount = algosdk.mnemonicToSecretKey(passphrase);

export const getChainDriver = (chain: string) => {
    const ethDriver = new EthDriver('Mainnet', {
        serverUrl: process.env.MORALIS_SERVER_URL ? process.env.MORALIS_SERVER_URL : '',
        appId: process.env.MORALIS_APP_ID ? process.env.MORALIS_APP_ID : '',
        masterKey: process.env.MORALIS_APP_MASTER_KEY ? process.env.MORALIS_APP_MASTER_KEY : ''
    });
    const algoTestnetDriver = new AlgoDriver('Testnet', process.env.ALGO_API_KEY ? process.env.ALGO_API_KEY : '');
    const algoMainnetDriver = new AlgoDriver('Mainnet', process.env.ALGO_API_KEY ? process.env.ALGO_API_KEY : '');

    switch (chain) {
        case 'Algorand Testnet':
            return algoTestnetDriver;
        case 'Algorand Mainnet':
            return algoMainnetDriver;
        case 'Ethereum':
            return ethDriver;
        default:
            return algoTestnetDriver;
    }
}