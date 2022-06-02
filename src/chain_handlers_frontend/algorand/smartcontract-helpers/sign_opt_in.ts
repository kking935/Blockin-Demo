import WalletConnect from "@walletconnect/client";
import { createWCRequest } from '../WalletConnect';
import { parse, stringify } from '../../../utils/preserveJson';

export const signOptIn = async (connector: WalletConnect, assetId: string) => {
    const data = await fetch('../api/createOptInTxn', {
        method: 'post',
        body: JSON.stringify({
            to: connector.accounts[0],
            assetId
        }),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json());

    const uTxn = parse(data.uTxn);  //little hack to preserve Uint8Arrays

    const wcRequest = await createWCRequest([uTxn])
    const result: Array<string | null> = await connector.sendCustomRequest(wcRequest);
    const decodedResult = result.map(element => {
        return element ? new Uint8Array(Buffer.from(element, "base64")) : null;
    });

    if (!decodedResult) {
        console.log("ERROR: decodeResult is undefined")
        return
    }
    const stxs: Uint8Array[] = []
    decodedResult.forEach((elem) => {
        if (elem != null) {
            stxs.push(elem)
        }
    });

    const body = {
        stxs,
        uTxn
    }

    const bodyStr = stringify(body); //little hack to preserve Uint8Arrays

    await fetch('../api/sendTxnToNetwork', {
        method: 'post',
        body: bodyStr,
        headers: { 'Content-Type': 'application/json' }
    })
}