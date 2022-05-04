import { NextApiRequest, NextApiResponse } from "next";
import { myAccount } from "./apiConstants";
import { createAssetTransferTxn, sendTxn } from "blockin";

const enc = new TextEncoder();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    let assetId = req.query.assetId;
    let address = req.query.address;

    if (typeof address != "string") {
        address = address[0]
    }
    if (typeof assetId != "number") {
        assetId = assetId[0]
    }
    const token = await receiveToken(address, assetId);
    console.log("TOKEN", token);
    return res.status(200).send(token);
};

export async function receiveToken(address: string, assetId: string) {
    try {
        // params.fee = 1000;
        // params.flatFee = true;
        let uTxn = await createAssetTransferTxn({
            from: myAccount.addr,
            to: address,
            amount: 1,
            assetIndex: Number(assetId),
        })

        const txn = uTxn.nativeTxn
        let signedTxn = txn.signTxn(myAccount.sk);
        console.log("Signed transaction with txID: %s", uTxn.txnId);

        await sendTxn(signedTxn, uTxn.txnId)
        console.log("Successfully sent 1 of asset", uTxn.txnId)

        return { address: myAccount.addr, assetId }
    }
    catch (err) {
        console.log("err", err);
    }
};