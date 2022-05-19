import { NextApiRequest, NextApiResponse } from "next";
import { setChainDriver } from 'blockin-test-package';
import { getColorFromMetadata } from "../../permissions/permissions";
import { AlgoDriver } from "../../blockin-walletconnect-helpers/AlgoDriver";

const chainDriver = new AlgoDriver('Testnet', process.env.ALGO_API_KEY ? process.env.ALGO_API_KEY : '');
setChainDriver(chainDriver)

const getAssetRequest = async (req: NextApiRequest, res: NextApiResponse) => {
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
