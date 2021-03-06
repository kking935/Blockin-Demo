import { NextApiRequest, NextApiResponse } from "next";
import { createAssetTxn, setChainDriver } from 'blockin';
import { sha256 } from "../../permissions/sha256";
import { stringify } from "../../utils/preserveJson";
import AlgoDriver from "blockin-algo-driver";
import { getChainDriver } from "./apiConstants";


const createAssetRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const chainDriver = getChainDriver(req.body.chain);
    setChainDriver(chainDriver);

    const from = req.body.from;
    const assetAuthorization = req.body.assetAuthorization;

    // Create asset, sign, and send to network
    const uTxn = await createAssetTxn({
        from,
        assetMetadata: sha256(assetAuthorization),
    });

    const uTxnString = stringify(uTxn);  //little hack to preserve Uint8Arrays

    return res.status(200).json({ uTxn: uTxnString });
};

export default createAssetRequest;
