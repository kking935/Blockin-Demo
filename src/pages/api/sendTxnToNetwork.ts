import { NextApiRequest, NextApiResponse } from "next";
import { sendTxn, setChainDriver } from 'blockin';
import { parse } from "../../utils/preserveJson";
import AlgoDriver from "blockin-algo-driver";
import { getChainDriver } from "./apiConstants";

const enc = new TextEncoder();

const sendTxnRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const chainDriver = getChainDriver(req.body.chain);
    setChainDriver(chainDriver);

    const body = parse(JSON.stringify(req.body)); //little hack to preserve Uint8Arrays

    const sendTx = await sendTxn(body.stxs, body.uTxn.txnId)

    console.log("Transaction : " + sendTx.txId);
    return res.status(200).send(sendTx);
};

export default sendTxnRequest;
