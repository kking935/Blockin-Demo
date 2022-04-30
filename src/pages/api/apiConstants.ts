import algosdk from 'algosdk';

export const passphrase = "absorb uncover brush page width axis giant path hint shoe cover brave kingdom above slender category awkward voyage drum lunar fire cradle weapon abstract project"
export const myAccount = algosdk.mnemonicToSecretKey(passphrase)

const algodToken = { "x-api-key": "H4sefDbnoL8GO8ooRkxQM6CePHih5XDQ405mcBKy" }
const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
const algodPort = '';
export let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

const indexerServer = "https://testnet-algorand.api.purestake.io/idx2";
export let algodIndexer = new algosdk.Indexer(algodToken, indexerServer, algodPort)
