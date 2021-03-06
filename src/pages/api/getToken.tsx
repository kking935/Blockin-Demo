import { NextApiRequest, NextApiResponse } from "next";
import { myAccount } from "./apiConstants";
import { createAssetTxn, sendTxn, setChainDriver } from 'blockin';
import { sha256 } from "../../permissions/sha256";
import AlgoDriver from "blockin-algo-driver";
import { getChainDriver } from "./apiConstants";

const enc = new TextEncoder();

const getTokenRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const token = await createAccessToken(req.body.chain);
    return res.status(200).send(token);
};

export default getTokenRequest;

function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function createAccessToken(chain: string) {
    const chainDriver = getChainDriver(chain);
    setChainDriver(chainDriver);

    try {
        const colors = ['red', 'blue', 'green', 'pink', 'purple'];
        // const randomIdx = getRandomIntInclusive(0, 4);
        const randomIdx = 0;
        const metadataPlainText = colors[randomIdx];
        const metadataHash = sha256(metadataPlainText);

        let uTxn = await createAssetTxn({
            from: myAccount.addr,
            assetName: "Sample Resource Creates Asset",
            total: 1,
            decimals: 0,
            extras: {
                note: enc.encode("Sample Resource Creates Asset"),
                assetMetadata: metadataHash,
            }
        })

        let signedTxn = uTxn.nativeTxn.signTxn(myAccount.sk);
        console.log("Signed transaction with txID: %s", uTxn.txnId);

        await sendTxn(signedTxn, uTxn.txnId)
        const assetDetails = await chainDriver.lookupTransactionById(uTxn.txnId);

        return { address: myAccount.addr, assetId: assetDetails.transaction['created-asset-index'], metadata: colors[randomIdx] }
    }
    catch (err) {
        console.log("err", err);
    }
};