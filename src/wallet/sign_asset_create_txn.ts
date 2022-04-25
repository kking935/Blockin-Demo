import { makeAssetCreateTxn, sha256 } from '../../blockin'
import algosdk, { waitForConfirmation } from "algosdk";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import WalletConnect from '@walletconnect/client';

export const signAssetCreateTxn = async (connector: WalletConnect, assetAuthorization: string) => {
    //Generate an opt in tx
    // Sign transaction
    // txns is an array of algosdk.Transaction like below
    // i.e txns = [txn, ...someotherTxns], but we've only built one transaction in our case
    console.log("SHA 256")
    console.log(connector.accounts[0] + "_SITESECRET_" + assetAuthorization)
    console.log(await sha256(connector.accounts[0] + "_SITESECRET_" + assetAuthorization))
    const txns = [await makeAssetCreateTxn(connector.accounts[0], "Blockin", "AUTH", 1, "blockin-demo", await sha256(assetAuthorization))]
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
        await waitForConfirmation(algodClient, sendTx.txId, 1000);

        console.log("Transaction : " + sendTx.txId);
    }
}