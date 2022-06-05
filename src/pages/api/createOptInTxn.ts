import { NextApiRequest, NextApiResponse } from "next";
import { createAssetTxn, setChainDriver } from 'blockin';
import { stringify } from "../../utils/preserveJson";
import AlgoDriver from "blockin-algo-driver";
import { getChainDriver } from "./apiConstants";


const createOptInTxn = async (req: NextApiRequest, res: NextApiResponse) => {
    const chainDriver = getChainDriver(req.body.chain);
    setChainDriver(chainDriver);

    const to = req.body.to;
    const assetId = req.body.assetId;

    // Create asset, sign, and send to network
    if (chainDriver instanceof AlgoDriver) {
        const uTxn = await chainDriver.makeAssetOptInTxn({
            to,
            assetIndex: Number(assetId),
        });

        const uTxnString = stringify(uTxn);  //little hack to preserve Uint8Arrays


        return res.status(200).json({ uTxn: uTxnString });
    } else {
        throw 'ChainDriver not an instance of AlgoDriver';
    }
};

export default createOptInTxn;
