import { createAssetTxn, sendTxn, sha256 } from 'blockin'
import WalletConnect from '@walletconnect/client';
import { createWCRequest } from '../WalletConnect';

export const signAssetCreateTxn = async (connector: WalletConnect, assetAuthorization: string) => {
    // Create asset, sign, and send to network
    const unsignedCreateAssetTxn = await createAssetTxn({
        from: connector.accounts[0],
        assetMetadata: await sha256(assetAuthorization),
    })
    const wcResult = await createWCRequest([unsignedCreateAssetTxn])
    const signedCreateAssetTxn = await connector.sendCustomRequest(wcResult)
    const result = await sendTxn(signedCreateAssetTxn, unsignedCreateAssetTxn.txnId) // this could be done without Blockin
}