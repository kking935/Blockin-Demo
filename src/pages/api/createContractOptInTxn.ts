import { NextApiRequest, NextApiResponse } from "next";
import { setChainDriver } from 'blockin';
import { stringify } from "../../utils/preserveJson";
import AlgoDriver from "blockin-algo-driver";
import { getChainDriver } from "./apiConstants";

const createContractOptInRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const chainDriver = getChainDriver(req.body.chain);
    setChainDriver(chainDriver);

    const from = req.body.from;
    const contractId = req.body.contractId;
    if (chainDriver instanceof AlgoDriver) {
        // Create asset, sign, and send to network
        const uTxn = await chainDriver.makeContractOptInTxn({
            from,
            appIndex: Number(contractId),
        });

        const uTxnString = stringify(uTxn);  //little hack to preserve Uint8Arrays

        return res.status(200).json({ uTxn: uTxnString });
    } else {
        throw 'ChainDriver not an instance of AlgoDriver';
    }
};

export default createContractOptInRequest;
