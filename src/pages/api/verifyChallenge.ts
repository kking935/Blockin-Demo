import { NextApiRequest, NextApiResponse } from "next";
import { AlgoDriver, setChainDriver, verifyChallenge } from "blockin";
import { parse } from "../../utils/preserveJson";

setChainDriver(new AlgoDriver(process.env.ALGO_API_KEY ? process.env.ALGO_API_KEY : ''))

const verifyChallengeRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const body = parse(JSON.stringify(req.body)); //little hack to preserve Uint8Arrays

    console.log(body);

    const message = await verifyChallenge(
        body.txnBytes,
        body.signature
    );


    return res.status(200).json({ message });
};

export default verifyChallengeRequest;
