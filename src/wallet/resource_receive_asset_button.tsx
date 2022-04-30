import { Dispatch, SetStateAction, SyntheticEvent, useState } from "react"
import { useCookies } from "react-cookie"
import { AssetLink } from "../components/assetLink"
import { useWalletContext } from "../contexts/WalletContext"
import { signChallenge } from "./sign_challenge"



export const ReceiveAssetFromResourceButton = ({ asset }: { asset: string }) => {
    const { connector } = useWalletContext();
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
    }


    return <>
        <button type='submit' onClick={resourceReceiveAsset}>Receive Asset to Your Wallet</button>
        {waiting && <p>Awaiting asset transfer confirmation....</p>}
        {resourceTransferred && <>
            <p>Congrats, you now own this asset in your wallet!</p>
        </>}
    </>
}