import { createAssetTxn, sendTxn, sha256 } from 'blockin'
import WalletConnect from '@walletconnect/client';
import { createWCRequest } from '../WalletConnect';

export const signAssetCreateTxn = async (connector: WalletConnect, assetAuthorization: string) => {
    // Create asset, sign, and send to network
    const uTxn = await createAssetTxn({
        from: connector.accounts[0],
        assetMetadata: await sha256(assetAuthorization),
    })
    const wcResult = await createWCRequest([uTxn])
    const result: Array<string | null> = await connector.sendCustomRequest(wcResult)
    const decodedResult = result.map(element => {
        return element ? new Uint8Array(Buffer.from(element, "base64")) : null;
    });
    
    if (!decodedResult) {
        console.log("ERROR: decodeResult is undefined")
        return
    }
    const stxs: Uint8Array[] = []
    decodedResult.forEach((elem) => {
        if (elem != null) {
            stxs.push(elem)
        }
    });
    const sendTx = await sendTxn(stxs, uTxn.txnId)
    console.log("Transaction : " + sendTx.txId);
}