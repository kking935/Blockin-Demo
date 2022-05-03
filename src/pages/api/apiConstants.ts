import algosdk from 'algosdk';

export const passphrase = process.env.RESOURCE_PASSPHRASE ? process.env.RESOURCE_PASSPHRASE : '';
export const myAccount = algosdk.mnemonicToSecretKey(passphrase)

const algodToken = { "x-api-key": process.env.ALGO_API_KEY ? process.env.ALGO_API_KEY : '' }
const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
const algodPort = '';
export let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

const indexerServer = "https://testnet-algorand.api.purestake.io/idx2";
export let algodIndexer = new algosdk.Indexer(algodToken, indexerServer, algodPort)
