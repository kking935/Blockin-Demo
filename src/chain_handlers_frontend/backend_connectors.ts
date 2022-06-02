import { stringify } from "../utils/preserveJson";

export async function getAssets(chain: string, address: string, assetMap: any, includeColors: boolean) {
    const data = await fetch('../api/getAssets', {
        method: 'post',
        body: JSON.stringify({
            address,
            includeColors,
            assetMap,
            chain
        }),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json());

    return data;
}

export const getChallenge = async (chain: string, address: string, assetIds: string[]) => {
    const assets = [];
    for (const assetId of assetIds) {
        assets.push('Asset ID: ' + assetId);
    }

    const message = await getChallengeFromBlockin(chain, address, assets);
    return message;
}

const getChallengeFromBlockin = async (chain: string, address: string, assetIds: string[]): Promise<string> => {
    const data = await fetch('../api/getChallenge', {
        method: 'post',
        body: JSON.stringify({
            address,
            assetIds,
            chain
        }),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json());

    return data.message;
}

export const verifyChallengeOnBackend = async (chain: string, originalBytes: Uint8Array, signatureBytes: Uint8Array) => {
    const bodyStr = stringify({ originalBytes, signatureBytes, chain }); //hack to preserve uint8 arrays
    console.log(bodyStr);

    const verificationRes = await fetch('../api/verifyChallenge', {
        method: 'post',
        body: bodyStr,
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json());

    return verificationRes;
}



/** 
 *  IMPORTANT: Note that nothing with the signatures is imported from Blockin. Blockin does not handle any
 *  signature functionality. All of this must be implemented in the client. This function uses WalletConnect
 *  and algoSDK to sign the challenge inputted as the 'message' parameter. Once everything is handled with
 *  the signatures, we eventually call verifyChallenge() which takes the signature ad an input. Blockin will
 *  never use your private keys.
 */

