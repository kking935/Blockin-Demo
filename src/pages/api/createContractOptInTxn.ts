import { NextApiRequest, NextApiResponse } from "next";
import { setChainDriver } from 'blockin-test-package';
import { stringify } from "../../utils/preserveJson";
import AlgoDriver from "blockin-algo-driver";

const chainDriver = new AlgoDriver('Testnet', process.env.ALGO_API_KEY ? process.env.ALGO_API_KEY : '')
setChainDriver(chainDriver);

const createContractOptInRequest = async (req: NextApiRequest, res: NextApiResponse) => {

    const from = req.body.from;
    const contractId = req.body.contractId;

    // Create asset, sign, and send to network
    const uTxn = await chainDriver.makeContractOptInTxn({
        from,
        appIndex: Number(contractId),
    });

    const uTxnString = stringify(uTxn);  //little hack to preserve Uint8Arrays

    return res.status(200).json({ uTxn: uTxnString });
};

export default createContractOptInRequest;
