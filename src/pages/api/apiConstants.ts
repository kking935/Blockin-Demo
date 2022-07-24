import algosdk from 'algosdk';
import AlgoDriver from 'blockin-algo-driver';
import EthDriver from 'blockin-eth-driver';

export const passphrase = process.env.RESOURCE_PASSPHRASE ? process.env.RESOURCE_PASSPHRASE : '';
export const myAccount = algosdk.mnemonicToSecretKey(passphrase);

export const getChainDriver = (chain: string) => {
    const ethDriver = new EthDriver('eth', {
        serverUrl: process.env.MORALIS_SERVER_URL ? process.env.MORALIS_SERVER_URL : '',
        appId: process.env.MORALIS_APP_ID ? process.env.MORALIS_APP_ID : '',
        masterKey: process.env.MORALIS_APP_MASTER_KEY ? process.env.MORALIS_APP_MASTER_KEY : ''
    });

    const polygonDriver = new EthDriver('polygon', {
        serverUrl: process.env.MORALIS_SERVER_URL ? process.env.MORALIS_SERVER_URL : '',
        appId: process.env.MORALIS_APP_ID ? process.env.MORALIS_APP_ID : '',
        masterKey: process.env.MORALIS_APP_MASTER_KEY ? process.env.MORALIS_APP_MASTER_KEY : ''
    });

    const bscDriver = new EthDriver('bsc', {
        serverUrl: process.env.MORALIS_SERVER_URL ? process.env.MORALIS_SERVER_URL : '',
        appId: process.env.MORALIS_APP_ID ? process.env.MORALIS_APP_ID : '',
        masterKey: process.env.MORALIS_APP_MASTER_KEY ? process.env.MORALIS_APP_MASTER_KEY : ''
    });

    const avalancheDriver = new EthDriver('avalanche', {
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
            case 'Polygon':
            return polygonDriver;
        case 'Avalanche':
            return avalancheDriver;
        case 'BSC':
            return bscDriver;
        case 'Ethereum':
            return ethDriver;
        default:
            return algoTestnetDriver;
    }
}