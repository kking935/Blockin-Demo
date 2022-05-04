import { NextApiRequest, NextApiResponse } from "next";
import { AlgoDriver, createChallenge, setChainDriver } from "blockin";


setChainDriver(new AlgoDriver(process.env.ALGO_API_KEY ? process.env.ALGO_API_KEY : ''))

const getChallengeRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const message = await createChallenge({
        domain: 'https://blockin.com',
        statement: 'Sign in to this website via Blockin. You will remain signed in until you terminate your browser session.',
        address: req.body.address,
        uri: '',
        expirationDate: '2022-05-22T18:19:55.901Z',
        notBefore: undefined,
        resources: req.body.assetIds
    });


    return res.status(200).json({ message });
};

export default getChallengeRequest;