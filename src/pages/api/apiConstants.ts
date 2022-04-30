import algosdk from 'algosdk';

export const passphrase = "nice coyote harsh sound child arm muffin lunch family rotate genuine hand dance shoe pitch retreat discover vacant tennis suit hen enact filter absent cross"
export const myAccount = algosdk.mnemonicToSecretKey(passphrase)

const algodToken = { "x-api-key": "H4sefDbnoL8GO8ooRkxQM6CePHih5XDQ405mcBKy" }
const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
const algodPort = '';
export let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

const indexerServer = "https://testnet-algorand.api.purestake.io/idx2";
export let algodIndexer = new algosdk.Indexer(algodToken, indexerServer, algodPort)
