import algosdk from 'algosdk';

export const passphrase = process.env.RESOURCE_PASSPHRASE ? process.env.RESOURCE_PASSPHRASE : '';
export const myAccount = algosdk.mnemonicToSecretKey(passphrase)