import { NextApiRequest, NextApiResponse } from "next";
import crypto from 'crypto';
import { myAccount, algodIndexer } from "./apiConstants";
import { createAssetTxn, sendTxn } from "blockin";

const enc = new TextEncoder();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const token = await createAccessToken();
    console.log("TOKEN", token);
    return res.status(200).send(token);
};

function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function createAccessToken() {
    try {
        const colors = ['red', 'blue', 'green', 'pink', 'purple'];
        const randomIdx = getRandomIntInclusive(0, 4);
        const metadataPlainText = colors[randomIdx]
        // let params = await algodClient.getTransactionParams().do();
        // params.fee = 1000;
        // params.flatFee = true;
        const hash = crypto.createHash('sha256');
        hash.update(metadataPlainText);
        const hashBuffer = hash.digest();
        const metadataHash = new Uint8Array(hashBuffer);

        let uTxn = await createAssetTxn({
            from: myAccount.addr,
            assetName: "Sample Resource Creates Asset",
            total: 1,
            decimals: 0,
            extras: {
                note: enc.encode("Sample Resource Creates Asset"),
                assetMetadataHash: metadataHash,
            }
        })

        let signedTxn = uTxn.nativeTxn.signTxn(myAccount.sk);
        console.log("Signed transaction with txID: %s", uTxn.txnId);

        await sendTxn(signedTxn, uTxn.txnId)
        console.log("Successfully created asset", uTxn.txnId)
        const assetDetails = await algodIndexer.lookupTransactionByID(uTxn.txnId).do();
        console.log(assetDetails)

        return { address: myAccount.addr, assetId: assetDetails.transaction['created-asset-index'], metadata: colors[randomIdx] }
    }
    catch (err) {
        console.log("err", err);
    }
};