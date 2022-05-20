import { myAccount } from "./apiConstants";
import { NextApiRequest, NextApiResponse } from "next";
import { sendTxn, setChainDriver } from 'blockin';
import { sha256 } from "../../permissions/sha256";
import AlgoDriver from "blockin-algo-driver";

const chainDriver = new AlgoDriver('Testnet', process.env.ALGO_API_KEY ? process.env.ALGO_API_KEY : '')
setChainDriver(chainDriver);

const localContractCreateAssetRequest = async (req: NextApiRequest, res: NextApiResponse) => {

    const address = req.body.address;
    const contractId = req.body.contractId;
    const metaData = req.body.metaData;

    const num_asset = new Uint8Array(1)
    num_asset[0] = 1
    //application_args = (user_address, asset_total, asset_unit_name, asset_name, asset_url, asset_metadata_hash, asset_manager_address)
    // Create asset, sign, and send to network
    const encoder = new TextEncoder()
    const uTxn = await chainDriver.makeContractNoOpTxn({
        from: myAccount.addr,
        appIndex: Number(contractId),
        appArgs: [num_asset, encoder.encode('blkn'), encoder.encode('Blockin Demo'), encoder.encode('https://www.blockin.vercel.app'), await sha256(metaData)],
        accounts: [address],
        foreignAssets: undefined
    });

    let signedTxn = uTxn.nativeTxn.signTxn(myAccount.sk);
    console.log("Signed transaction with txID: %s", uTxn.txnId);
    const sentTxn = await sendTxn(signedTxn, uTxn.txnId)
    console.log(sentTxn)
    console.log("TODO: return data: assetId")
    const all_local_states = await chainDriver.lookupApplicationLocalState(address)
    let asset_id = 0
    all_local_states['apps-local-states'].forEach((elem: any) => {
        if (elem.id == process.env.NEXT_PUBLIC_LOCAL_CONTRACT_ID) {
            asset_id = elem['key-value'][0].value.uint
            console.log(asset_id)
        }
    });

    return res.status(200).json({ assetId: asset_id });
};

export default localContractCreateAssetRequest;
