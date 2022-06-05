import { NextApiRequest, NextApiResponse } from "next";
import { setChainDriver } from 'blockin';
import AlgoDriver from "blockin-algo-driver";
import { getChainDriver } from "./apiConstants";

const getAssetDetailsRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const chainDriver = getChainDriver(req.body.chain);
    setChainDriver(chainDriver);

    const assetInfo = await chainDriver.getAssetDetails(req.body.id);

    return res.status(200).json(assetInfo);
};

export default getAssetDetailsRequest;
