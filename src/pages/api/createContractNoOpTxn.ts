import { NextApiRequest, NextApiResponse } from "next";
import { sendTxn, setChainDriver } from 'blockin';
import { myAccount } from "./apiConstants";
import { stringify } from "../../utils/preserveJson";
import AlgoDriver from "blockin-algo-driver";
import { getChainDriver } from "./apiConstants";

const createContractNoOpRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const chainDriver = getChainDriver(req.body.chain);
    setChainDriver(chainDriver);

    const from = req.body.from;
    const contractId = req.body.contractId;
    const assetId = req.body.assetId;

    console.log("contractId")
    console.log(contractId)
    if (chainDriver instanceof AlgoDriver) {
        const uTxn = await chainDriver.makeContractNoOpTxn({
            from: from,
            appIndex: Number(contractId),
            accounts: [from],
            foreignAssets: [Number(assetId)],
            appArgs: undefined
        });

        const uTxnString = stringify(uTxn);  //little hack to preserve Uint8Arrays
        return res.status(200).json({ uTxn: uTxnString });
    } else {
        throw 'ChainDriver not an instance of AlgoDriver';
    }
};

export default createContractNoOpRequest;
