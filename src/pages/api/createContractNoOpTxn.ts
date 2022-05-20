import { NextApiRequest, NextApiResponse } from "next";
import { sendTxn, setChainDriver } from 'blockin-test-package';
import { myAccount } from "./apiConstants";
import { stringify } from "../../utils/preserveJson";
import AlgoDriver from "blockin-algo-driver";

const chainDriver = new AlgoDriver('Testnet', process.env.ALGO_API_KEY ? process.env.ALGO_API_KEY : '')
setChainDriver(chainDriver);

const createContractNoOpRequest = async (req: NextApiRequest, res: NextApiResponse) => {

    const from = req.body.from;
    const contractId = req.body.contractId;
    const assetId = req.body.assetId;

    console.log("contractId")
    console.log(contractId)
    const uTxn = await chainDriver.makeContractNoOpTxn({
        from: from,
        appIndex: Number(contractId),
        accounts: [from],
        foreignAssets: [Number(assetId)],
        appArgs: undefined
    });

    const uTxnString = stringify(uTxn);  //little hack to preserve Uint8Arrays
    return res.status(200).json({ uTxn: uTxnString });
};

export default createContractNoOpRequest;
