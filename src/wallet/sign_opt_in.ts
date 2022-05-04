import WalletConnect from "@walletconnect/client";
import { createAssetOptInTxn, sendTxn } from 'blockin'
import { createWCRequest } from "../WalletConnect";

export const signOptIn = async (connector: WalletConnect, assetId: string) => {
    let uTxn = await createAssetOptInTxn({
        to: connector.accounts[0],
        assetIndex: Number(assetId)
    })

    const wcRequest = await createWCRequest([uTxn])
    const signedTxn = await connector.sendCustomRequest(wcRequest);

    const sentTxn = await sendTxn(signedTxn, uTxn.txnId)
    console.log("Transaction : " + uTxn.txnId);
}
