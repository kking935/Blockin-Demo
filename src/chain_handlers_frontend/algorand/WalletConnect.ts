import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { UniversalTxn } from 'blockin';
import { Dispatch, SetStateAction } from "react";

export const connect = (setConnector: Dispatch<SetStateAction<WalletConnect | undefined>>, setAddress: Dispatch<SetStateAction<string>>, setConnected: Dispatch<SetStateAction<boolean>>) => {
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

    setConnector(connector);
    if (connector.accounts[0]) {
        setAddress(connector.accounts[0]);
        setConnected(true);
    }

}

export const createWCRequest = async (uTxns: UniversalTxn[]) => {
    const txnsToSign = uTxns.map(uTxn => {
        return {
            txn: Buffer.from(uTxn.txn).toString("base64"),
            message: uTxn.message,
            // Note: if the transaction does not need to be signed (because it's part of an atomic group
            // that will be signed by another party), specify an empty singers array like so:
            // signers: [],
        };
    });

    const request = formatJsonRpcRequest("algo_signTxn", [txnsToSign]);
    return request
}
