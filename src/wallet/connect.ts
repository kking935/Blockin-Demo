import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import algosdk, { Transaction } from "algosdk";
import { UniversalTxn } from "blockin";

export const connect = (): WalletConnect => {
    // Create a connector
    const connector = new WalletConnect({
        bridge: "https://bridge.walletconnect.org", // Required
        qrcodeModal: QRCodeModal,
    });

    // Check if connection is already established
    if (!connector.connected) {
        // create new session
        connector.createSession();
    }

    // Subscribe to connection events
    connector.on("connect", (error, payload) => {
        if (error) {
            throw error;
        }

        // Get provided accounts and chainId
        const { accounts, chainId } = payload.params[0];
    });

    connector.on("session_update", (error, payload) => {
        if (error) {
            throw error;
        }

        // Get updated accounts and chainId
        const { accounts, chainId } = payload.params[0];
    });

    connector.on("disconnect", (error, payload) => {
        if (error) {
            throw error;
        }

        // Delete connector
    });

    return connector
}

export const createWCRequest = async (uTxns: UniversalTxn[]) => {   
    // Sign transaction
    // txns is an array of algosdk.Transaction like below
    // i.e txns = [txn, ...someotherTxns], but we've only built one transaction in our case
    const txnsToSign = uTxns.map(uTxn => {
        return {
            txn: uTxn.txn,
            message: uTxn.message,
            // Note: if the transaction does not need to be signed (because it's part of an atomic group
            // that will be signed by another party), specify an empty singers array like so:
            // signers: [],
        };
    });

    const requestParams = [txnsToSign];
    const request = formatJsonRpcRequest("algo_signTxn", requestParams);
    return request
}
