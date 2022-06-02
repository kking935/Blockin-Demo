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
    console.log("BEFORE", assets, address);
    const allAssets = await chainDriver.getAllAssetsForAddress(address);
    console.log("AFTER", allAssets, assets);
    const newAssetMap = assetMap;

    for (const asset of allAssets) {
        if (asset['amount'] > 0) {
            assets.push(asset);
        }
    }

    for (const asset of assets) {

        const id: string = asset['asset-id'];
        if (!newAssetMap[id]) {
            const assetInfo = await chainDriver.getAssetDetails(id);
            newAssetMap[id] = assetInfo;
        }

        if (includeColors) {
            asset['color'] = await getColorFromMetadata(newAssetMap[id]['metadata-hash']);


            if (!asset['color']) {
                asset['color'] = 'Custom';
            } else {
                asset['color'] = asset['color'].charAt(0).toUpperCase() + asset['color'].slice(1);
            }
        }
    }

    return res.status(200).json({ assets, assetMap: newAssetMap });
};

export default getAssetRequest;
