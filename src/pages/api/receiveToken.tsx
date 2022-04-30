import { NextApiRequest, NextApiResponse } from "next";
import algosdk from 'algosdk';
import { algodClient, myAccount, algodIndexer } from "./apiConstants";

const enc = new TextEncoder();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const assetId = req.query.assetId;
    const address = req.query.address;

    const token = await receiveToken(address, assetId);
    console.log("TOKEN", token);
    return res.status(200).send(token);
};

const createSendAssetTxn = async (address: string, assetId: string) => {
    let params = await algodClient.getTransactionParams().do();
    params.fee = 1000;
    params.flatFee = true;

    return algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: myAccount.addr,
        to: address,
        suggestedParams: params,
        amount: 1,
        assetIndex: Number(assetId)
    });
}


export async function receiveToken(address: string, assetId: string) {
    try {

        let txn = await createSendAssetTxn(address, assetId);

        let signedTxn = txn.signTxn(myAccount.sk);
        let txId = txn.txID().toString();
        console.log("Signed transaction with txID: %s", txId);

        await algodClient.sendRawTransaction(signedTxn).do();
        await algosdk.waitForConfirmation(algodClient, txId, 4);
        console.log("Successfully sent 1 of asset", txId)

        return { address: myAccount.addr, assetId }
    }
    catch (err) {
        console.log("err", err);
    }
};