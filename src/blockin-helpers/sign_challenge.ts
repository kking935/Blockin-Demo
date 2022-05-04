import algosdk from "algosdk";
import { createChallenge, createPaymentTxn, getAllAssets, getAssetDetails, verifyChallenge } from 'blockin'
import WalletConnect from '@walletconnect/client';
import { getColorFromMetadata } from "../permissions/permissions";
import { createWCRequest } from "../WalletConnect";

export async function getAssets(address: string, assetMap: any, includeColors: boolean) {
    const assets: any[] = [];

    const allAssets = await getAllAssets(address);
    const newAssetMap = assetMap;

    for (const asset of allAssets) {
        if (asset['amount'] > 0) {
            assets.push(asset);
        }
    }

    for (const asset of assets) {

        const id: string = asset['asset-id'];
        if (!newAssetMap[id]) {
            const assetInfo = await getAssetDetails(id);
            newAssetMap[id] = assetInfo;
        }

        if (includeColors) {
            asset['color'] = await getColorFromMetadata(newAssetMap[id]['metadata-hash']);


            if (!asset['color']) {
                asset['color'] = 'Custom';
            } else {
                asset['color'] = asset['color'].charAt(0).toUpperCase() + asset['color'].slice(1);
            }
        }
    }

    return { assets, assetMap: newAssetMap };
}

interface IScenarioTxn {
    txn: algosdk.Transaction;
    signers?: string[];
    authAddr?: string;
    message?: string;
}

type ScenarioReturnType = IScenarioTxn[][];
// ...End of api.ts from WalletConnect example

const getChallengeFromBlockin = async (connector: WalletConnect, assetIds: string[]): Promise<string> => {
    //we can also make these parameters inputs to the overall function to be more dynamic
    const message = await createChallenge({
        domain: 'https://blockin.com',
        statement: 'Sign in to this website via Blockin. You will remain signed in until you terminate your browser session.',
        address: connector?.accounts[0],
        uri: '',
        expirationDate: '2022-05-22T18:19:55.901Z',
        notBefore: undefined,
        resources: assetIds
    });

    return message
}

//confusing algoSDK stuff
const parseSignedTransactions = async (txnsFormattedForAlgoSdk: ScenarioReturnType, result: Array<string | null>):
    Promise<Array<Array<{
        txID: string;
        signingAddress?: string;
        signature: string;
    } | null>>> => {

    const indexToGroup = (index: number) => {
        for (let group = 0; group < txnsFormattedForAlgoSdk.length; group++) {
            const groupLength = txnsFormattedForAlgoSdk[group].length;
            if (index < groupLength) {
                return [group, index];
            }

            index -= groupLength;
        }

        throw new Error(`Index too large for groups: ${index}`);
    };

    const signedPartialTxns: Array<Array<Uint8Array | null>> = txnsFormattedForAlgoSdk.map(() => []);
    result.forEach((r, i) => {
        const [group, groupIndex] = indexToGroup(i);
        const toSign = txnsFormattedForAlgoSdk[group][groupIndex];

        if (r == null) {
            if (toSign.signers !== undefined && toSign.signers?.length < 1) {
                signedPartialTxns[group].push(null);
                return;
            }
            throw new Error(`Transaction at index ${i}: was not signed when it should have been`);
        }

        if (toSign.signers !== undefined && toSign.signers?.length < 1) {
            throw new Error(`Transaction at index ${i} was signed when it should not have been`);
        }

        const rawSignedTxn = Buffer.from(r, "base64");
        signedPartialTxns[group].push(new Uint8Array(rawSignedTxn));
    });

    const signedTxnInfo: Array<Array<{
        txID: string;
        signingAddress?: string;
        signature: string;
    } | null>> = signedPartialTxns.map((signedPartialTxnsInternal, group) => {
        return signedPartialTxnsInternal.map((rawSignedTxn, i) => {
            if (rawSignedTxn == null) {
                return null;
            }

            const signedTxn = algosdk.decodeSignedTransaction(rawSignedTxn);

            const txn = (signedTxn.txn as unknown) as algosdk.Transaction;
            const txID = txn.txID();
            const unsignedTxID = txnsFormattedForAlgoSdk[group][i].txn.txID();

            if (txID !== unsignedTxID) {
                throw new Error(
                    `Signed transaction at index ${i} differs from unsigned transaction. Got ${txID}, expected ${unsignedTxID}`,
                );
            }

            if (!signedTxn.sig) {
                throw new Error(`Signature not present on transaction at index ${i}`);
            }

            return {
                txID,
                signingAddress: signedTxn.sgnr ? algosdk.encodeAddress(signedTxn.sgnr) : undefined,
                signature: Buffer.from(signedTxn.sig).toString("base64"),
            };
        });
    });

    return signedTxnInfo;
}


export const getChallenge = async (connector: WalletConnect, assetIds: string[]) => {
    const message = await getChallengeFromBlockin(connector, assetIds);
    return message;
}


export const signChallenge = async (connector: WalletConnect, message: string) => {

    const unsignedTxn = await createPaymentTxn({
        from: connector.accounts[0],
        to: connector.accounts[0],
        amount: 0,
        extras: {
            note: new Uint8Array(Buffer.from(message))
        }
    })

    const wcRequest = await createWCRequest([unsignedTxn])
    const result: Array<string | null> = await connector.sendCustomRequest(wcRequest);
    if (result == null) {
        return 'Error: Failed to get result from WalletConnect.';
    }

    //Confusing AlgoSDK parsing stuff; returns a 2D array of the signed txns (since we have one 
    //txn and no groups, only [0][0] is defined)
    const txnsFormattedForAlgoSdk: ScenarioReturnType = [
        [
            {
                txn: unsignedTxn.nativeTxn,
                message
            },
        ]
    ];
    const signedTxnInfo = await parseSignedTransactions(txnsFormattedForAlgoSdk, result);

    //Get signature and call blockin's verifyChallenge
    if (signedTxnInfo && signedTxnInfo[0] && signedTxnInfo[0][0]) {
        //Get Uint8Arrays of a) the bytes that were signed and b) the signature
        const signature = Buffer.from(signedTxnInfo[0][0].signature, 'base64');
        const txnBytes = new Uint8Array(unsignedTxn.nativeTxn.bytesToSign());

        //Blockin verify
        //Note: It will always return a string and should never throw an error
        //Returns "Successfully granted access via Blockin" upon success
        const verificationRes = await verifyChallenge(txnBytes, signature);
        return verificationRes;
    }
    else {
        return 'Error: Error with signature response.';
    }
};