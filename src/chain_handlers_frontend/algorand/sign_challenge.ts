import WalletConnect from "@walletconnect/client";
import algosdk from "algosdk";
import { createWCRequest } from "./WalletConnect";

interface IScenarioTxn {
    txn: algosdk.Transaction;
    signers?: string[];
    authAddr?: string;
    message?: string;
}

type ScenarioReturnType = IScenarioTxn[][];
// ...End of api.ts from WalletConnect example
//confusing algoSDK stuff
export const parseSignedTransactions = async (txnsFormattedForAlgoSdk: ScenarioReturnType, result: Array<string | null>):
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
            const unsignedTxID: any = txnsFormattedForAlgoSdk[group][i].txn.txID();

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

export const signChallengeAlgo = async (connector: WalletConnect, message: string, testnet?: boolean) => {
    const uTxn = algosdk.makePaymentTxn(
        connector?.accounts[0],
        connector?.accounts[0],
        0,
        0,
        undefined,
        0,
        1000000,
        new Uint8Array(Buffer.from(message)),
        testnet ? 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=' : 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
        testnet ? 'testnet-v1.0' : 'mainnet-v1.0'
    );

    const unsignedTxn = {
        txn: algosdk.encodeUnsignedTransaction(uTxn),
        message: '',
        txnId: uTxn.txID().toString(),
        nativeTxn: uTxn
    }

    const wcRequest = await createWCRequest([unsignedTxn])
    const result: Array<string | null> = await connector.sendCustomRequest(wcRequest);
    if (result == null) {
        return { message: 'Error: Failed to get result from WalletConnect.', signatureBytes: new Uint8Array(0), originalBytes: new Uint8Array(0) };
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
        const signatureBytes = new Uint8Array(Buffer.from(signedTxnInfo[0][0].signature, 'base64'));
        const originalBytes = new Uint8Array(unsignedTxn.nativeTxn.bytesToSign());

        return { originalBytes, signatureBytes, message: 'Successfully signed message.', challengeString: message }
    }
    else {
        return { message: 'Error: Error with signature response.', signatureBytes: new Uint8Array(0), originalBytes: new Uint8Array(0) };
    }
}