import { NextApiRequest, NextApiResponse } from "next";
import algosdk from 'algosdk';
import crypto from 'crypto';
import { algodClient, myAccount, algodIndexer } from "./apiConstants";

const enc = new TextEncoder();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const token = await createAccessToken();
    console.log("TOKEN", token);
    return res.status(200).send(token);
};

const createAssetTxn = async (note: string, name: string, metadataPlainText: string) => {
    let params = await algodClient.getTransactionParams().do();
    params.fee = 1000;
    params.flatFee = true;

    const hash = crypto.createHash('sha256');

    hash.update(metadataPlainText);
    const hashBuffer = hash.digest();
    const metadataHash = new Uint8Array(hashBuffer);


    return algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: myAccount.addr,
        note: enc.encode(note),
        assetName: name,
        manager: myAccount.addr,
        freeze: myAccount.addr,
        clawback: myAccount.addr,
        assetMetadataHash: metadataHash,
        reserve: myAccount.addr,
        suggestedParams: params,
        total: 1,
        decimals: 0,
        defaultFrozen: false,
    })
}

function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function createAccessToken() {
    try {
        const colors = ['red', 'blue', 'green', 'pink', 'purple'];
        const randomIdx = getRandomIntInclusive(0, 4);

        let txn = await createAssetTxn("Sample Resource Creates Asset", "Sample Resource Creates Asset", colors[randomIdx])

        let signedTxn = txn.signTxn(myAccount.sk);
        let txId = txn.txID().toString();
        console.log("Signed transaction with txID: %s", txId);

        await algodClient.sendRawTransaction(signedTxn).do();
        await algosdk.waitForConfirmation(algodClient, txId, 4);
        console.log("Successfully created asset", txId)
        const assetDetails = await algodIndexer.lookupTransactionByID(txId).do();
        console.log(assetDetails)

        return { address: myAccount.addr, assetId: assetDetails.transaction['created-asset-index'], metadata: colors[randomIdx] }
    }
    catch (err) {
        console.log("err", err);
    }
};