import { NextApiRequest, NextApiResponse } from "next";
import { AlgoDriver, setChainDriver, verifyChallenge, getChallengeStringFromBytes, createMessageFromString, getAllAssets, getAssetDetails } from "blockin";
import { parse } from "../../utils/preserveJson";


const EXPECTED_DOMAIN = 'https://blockin.com';
const EXPECTED_URI = 'https://blockin.com/login'

const verifyDomainAndUri = (domain: string, uri: string) => {
    if (domain !== EXPECTED_DOMAIN) {
        throw `Domain !== ${EXPECTED_DOMAIN}`;
    }

    if (uri !== EXPECTED_URI) {
        throw `Uri !== ${EXPECTED_URI}`;
    }
}

const verifyNonce = (nonce: string) => {
    //TODO: Implement your own nonce verification scheme here
    //generateNonce() is defined within the signInButton props
}

const verifyChallengeRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const body = parse(JSON.stringify(req.body)); //little hack used to preserve Uint8Arrays
    switch (body.chain) {
        case 'Algorand':
            setChainDriver(new AlgoDriver(process.env.ALGO_API_KEY ? process.env.ALGO_API_KEY : ''))
        default:
            setChainDriver(new AlgoDriver(process.env.ALGO_API_KEY ? process.env.ALGO_API_KEY : ''))
    }

    try {
        /** 
         * First, we call Blockin's verifyChallenge(). This checks three things:
         * -Challenge (txnBytes) is well-formed
         * -Signature is valid and comes from address specified in challenge
         * -If assets are specified in the resources, it checks to see if the user owns them.
         * 
         * Throws an error if verify fails
         */
        const message = await verifyChallenge(
            body.originalBytes,
            body.signatureBytes
        );

        /**
         * Next, your backend should perform your own validity checks on the created challenge.
         * Blockin only verifies if it is well-formed, signed correctly, and if the address owns the asset.
         * 
         * Even though it most likely comes directly from your frontend, it is good practice to assert 
         * nothing was changed in transition.
         * 
         * For example, you should check at least the following:
         * -domain and uri is correct
         * -nonce is valid
         * 
         * Others that are good to check: 
         * -Expiration date / not before is reasonable
         * -Issued at is reasonable
         * -requested resources are what is expected
         * 
         * You can also search up the assets and their metadata using Blockin getAssetDetails()
         */

        const challengeString: string = await getChallengeStringFromBytes(body.originalBytes);
        const challenge = await createMessageFromString(challengeString);
        console.log(challenge)
        verifyDomainAndUri(challenge.domain, challenge.uri);
        verifyNonce(challenge.nonce);

        // for (const resource of challenge.resources) {
        //     if (resource.startsWith('Asset ID: ')) {
        //         const details = await getAssetDetails(resource.substring(10));
        //         console.log(details);
        //     }
        // }

        // if (challenge.resources && challenge.resources.includes('Asset ID: 88007716')) {
        //     setCookie('family', true, { 'path': '/' });
        // }
        // if (challenge.resources && challenge.resources.includes('Asset ID: 87987698')) {
        //     setCookie('standard', true, { 'path': '/' });
        // }
        // if (challenge.resources && challenge.resources.includes('https://blockin.com')) {
        //     setCookie('normal', true, { 'path': '/' });
        // }

        /**
         * Lastly once you reach here, the challenge is all verified. Now, you can grant the user permissions such
         * as session tokens, HTTP only cookies, etc.
         */

        return res.status(200).json({ success: true, message, challenge });
    } catch (err) {
        return res.status(200).json({ success: false, message: `${err}` });
    }
};

export default verifyChallengeRequest;
