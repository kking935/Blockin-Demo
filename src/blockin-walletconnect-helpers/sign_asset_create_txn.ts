import WalletConnect from '@walletconnect/client';
import { parse, stringify } from '../utils/preserveJson';
import { createWCRequest } from '../WalletConnect';

export const signAssetCreateTxn = async (connector: WalletConnect, assetAuthorization: string) => {
    const data = await fetch('../api/createAssetTxn', {
        method: 'post',
        body: JSON.stringify({
            from: connector?.accounts[0],
            assetAuthorization
        }),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json());

    const uTxn = parse(data.uTxn);  //little hack to preserve Uint8Arrays

    const wcResult = await createWCRequest([uTxn])
    const result: Array<string | null> = await connector.sendCustomRequest(wcResult)
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