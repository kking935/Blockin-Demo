import { NextApiRequest, NextApiResponse } from "next";
import { sendTxn, setChainDriver } from 'blockin-test-package';
import { parse } from "../../utils/preserveJson";
import { AlgoDriver } from "../../blockin-walletconnect-helpers/AlgoDriver";

const enc = new TextEncoder();
setChainDriver(new AlgoDriver('Testnet', process.env.ALGO_API_KEY ? process.env.ALGO_API_KEY : ''))

const sendTxnRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const body = parse(JSON.stringify(req.body)); //little hack to preserve Uint8Arrays

    const sendTx = await sendTxn(body.stxs, body.uTxn.txnId)

    console.log("Transaction : " + sendTx.txId);
    return res.status(200).send(sendTx);
};

export default sendTxnRequest;
