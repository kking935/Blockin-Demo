import { NextApiRequest, NextApiResponse } from "next";
import { createChallenge, generateNonceWithLastBlockTimestamp, setChainDriver } from 'blockin';
import AlgoDriver from "blockin-algo-driver";
import { getChainDriver } from "./apiConstants";

const getChallengeParamsRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const chainDriver = getChainDriver(req.body.chain);
    setChainDriver(chainDriver);

    // console.log(chainDriver);

    return res.status(200).json({
        domain: 'https://blockin.com',
        statement: 'Sign in to this website via Blockin. You will remain signed in until you terminate your browser session.',
        address: req.body.address,
        uri: 'https://blockin.com/login',
        nonce: await generateNonceWithLastBlockTimestamp(),
        expirationDate: '2022-12-22T18:19:55.901Z',
        notBefore: undefined,
        resources: req.body.assetIds
    });
};

export default getChallengeParamsRequest;
