import { NextApiRequest, NextApiResponse } from "next";
import { AlgoDriver, createAssetOptInTxn, createAssetTxn, setChainDriver } from "blockin";
import { stringify } from "../../utils/preserveJson";

setChainDriver(new AlgoDriver(process.env.ALGO_API_KEY ? process.env.ALGO_API_KEY : ''));

const createOptInTxn = async (req: NextApiRequest, res: NextApiResponse) => {

    const to = req.body.to;
    const assetId = req.body.assetId;

    // Create asset, sign, and send to network
    const uTxn = await createAssetOptInTxn({
        to,
        assetIndex: Number(assetId),
    });

    const uTxnString = stringify(uTxn);  //little hack to preserve Uint8Arrays

    return res.status(200).json({ uTxn: uTxnString });
};

export default createOptInTxn;
