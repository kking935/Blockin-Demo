import { createAssetOptInTxn, sendTxn } from 'blockin'
import WalletConnect from "@walletconnect/client";
import { createWCRequest } from '../WalletConnect';

export const signOptIn = async (connector: WalletConnect, assetId: string) => {
    let uTxn = await createAssetOptInTxn({
        to: connector.accounts[0],
        assetIndex: Number(assetId)
    })
    const wcRequest = await createWCRequest([uTxn])
    const result: Array<string | null> = await connector.sendCustomRequest(wcRequest);
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