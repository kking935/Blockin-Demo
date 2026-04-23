import { NextApiRequest, NextApiResponse } from "next";
import { setChainDriver } from 'blockin';
import { getColorFromMetadata } from "../../permissions/permissions";
import AlgoDriver from "blockin-algo-driver";
import { getChainDriver } from "./apiConstants";

const getAssetRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const chainDriver = getChainDriver(req.body.chain);
    setChainDriver(chainDriver);

    const address = req.body.address;
    const assetMap = req.body.assetMap;
    const includeColors = req.body.includeColors;

    const assets: any[] = [];
    const allAssets = await chainDriver.getAllAssetsForAddress(address);
    const newAssetMap = assetMap;

    for (const asset of allAssets) {
        if (asset['amount'] > 0) {
            assets.push(asset);
        }
    }

    return res.status(200).json({ assets, assetMap: newAssetMap });
};

export default getAssetRequest;
