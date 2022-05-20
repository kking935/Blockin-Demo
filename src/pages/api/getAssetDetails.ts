import { NextApiRequest, NextApiResponse } from "next";
import { setChainDriver } from 'blockin';
import AlgoDriver from "blockin-algo-driver";

const chainDriver = new AlgoDriver('Testnet', process.env.ALGO_API_KEY ? process.env.ALGO_API_KEY : '')
setChainDriver(chainDriver)

const getAssetDetailsRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const assetInfo = await chainDriver.getAssetDetails(req.body.id);

    return res.status(200).json(assetInfo);
};

export default getAssetDetailsRequest;
