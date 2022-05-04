import WalletConnect from "@walletconnect/client";
import { createAssetOptInTxn, sendTxn } from 'blockin'
import { createWCRequest } from "../WalletConnect";

export const signOptIn = async (connector: WalletConnect, assetId: string) => {
    //Generate an opt in tx
    // Sign transaction
    // txns is an array of algosdk.Transaction like below
    // i.e txns = [txn, ...someotherTxns], but we've only built one transaction in our case
    const txns = [await makeAssetOptInTxn(connector.accounts[0], Number(assetId))]
    const txnsToSign = txns.map(txn => {
        const encodedTxn = Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString("base64");

        return {
            txn: encodedTxn,
            message: 'Description of transaction being signed',
            // Note: if the transaction does not need to be signed (because it's part of an atomic group
            // that will be signed by another party), specify an empty singers array like so:
            // signers: [],
        };
    });

    const requestParams = [txnsToSign];
    const request = formatJsonRpcRequest("algo_signTxn", requestParams);
    const result: Array<string | null> = await connector.sendCustomRequest(request);
    const decodedResult = result.map(element => {
        return element ? new Uint8Array(Buffer.from(element, "base64")) : null;
    });
    console.log("Signed TXN")
    console.log(decodedResult)
    const algodServer = "https://testnet-algorand.api.purestake.io/ps2";

    const port = "";
    const token = {
        "x-api-key": "H4sefDbnoL8GO8ooRkxQM6CePHih5XDQ405mcBKy" // fill in yours
    };

    if (decodedResult != null) {
        const stxs: Uint8Array[] = []
        decodedResult.forEach((elem) => {
            if (elem != null) {
                stxs.push(elem)
            }
        });
        const algodClient = new algosdk.Algodv2(token, algodServer, port);
        const sendTx = await algodClient.sendRawTransaction(stxs).do();
        await waitForConfirmation(algodClient, sendTx.txId, 100)

        console.log("Transaction : " + sendTx.txId);
    }
}
