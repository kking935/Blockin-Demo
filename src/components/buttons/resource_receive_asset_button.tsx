import { SyntheticEvent, useState } from "react"
import { useAlgorandContext } from "../../chain_handlers_frontend/algorand/AlgorandContext"

export const ReceiveAssetFromResourceButton = ({ asset, updateAssets }: { asset: string, updateAssets: () => Promise<void> }) => {
    const { connector } = useAlgorandContext();
    const [waiting, setWaiting] = useState(false);
    const [resourceTransferred, setResourceTransferred] = useState(false);

    const resourceReceiveAsset = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (connector == undefined) {
            console.log("Failed to call signAssetCreateTxn because connector is undefined")
            return;
        }
        setWaiting(true);
        const res = await fetch(`../api/receiveToken?assetId=${asset}&address=${connector.accounts[0]}`);
        setWaiting(false);
        setResourceTransferred(true);
        updateAssets();
    }


    return <>
        <button type='submit' onClick={resourceReceiveAsset}>Receive Asset to Your Wallet</button>
        {waiting && <p>Awaiting asset transfer confirmation....</p>}
        {resourceTransferred && <>
            <p>Congrats, you now own this asset in your wallet!</p>
        </>}
    </>
}