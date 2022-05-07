import { NextApiRequest, NextApiResponse } from "next";
import { AlgoDriver, setChainDriver, verifyChallenge } from "blockin";
import { parse } from "../../utils/preserveJson";

setChainDriver(new AlgoDriver(process.env.ALGO_API_KEY ? process.env.ALGO_API_KEY : ''))

const verifyChallengeRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const body = parse(JSON.stringify(req.body)); //little hack to preserve Uint8Arrays

    try {
        const message = await verifyChallenge(
            body.txnBytes,
            body.signature,
            {
                verifyNonceWithBlockTimestamps: true
            }
        );

        return res.status(200).json({ verified: true, message });
    } catch (err) {
        return res.status(200).json({ verified: false, message: err });
    }

};

export default verifyChallengeRequest;
