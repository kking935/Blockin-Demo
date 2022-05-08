import { NextApiRequest, NextApiResponse } from "next";
import { AlgoDriver, getAssetDetails, setChainDriver } from "blockin";

setChainDriver(new AlgoDriver('Testnet', process.env.ALGO_API_KEY ? process.env.ALGO_API_KEY : ''))

const getAssetDetailsRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const assetInfo = await getAssetDetails(req.body.id);

    return res.status(200).json(assetInfo);
};

export default getAssetDetailsRequest;
