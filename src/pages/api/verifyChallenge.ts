import { NextApiRequest, NextApiResponse } from "next";
import { setChainDriver, verifyChallenge } from 'blockin';
import { parse } from "../../utils/preserveJson";
import AlgoDriver from "blockin-algo-driver";
import { getChainDriver } from "./apiConstants";


const verifyChallengeRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const chainDriver = getChainDriver(req.body.chain);
    setChainDriver(chainDriver);

    const body = parse(JSON.stringify(req.body)); //little hack to preserve Uint8Arrays

    try {
        console.log(Buffer.from(body.originalBytes).toString('utf8'))
        const verificationResponse = await verifyChallenge(
            body.originalBytes,
            body.signatureBytes,
            {
                verifyNonceWithBlockTimestamps: true
            }
        );

        return res.status(200).json({ verified: true, message: verificationResponse.message });
    } catch (err) {
        return res.status(200).json({ verified: false, message: `${err}` });
    }
};

export default verifyChallengeRequest;
