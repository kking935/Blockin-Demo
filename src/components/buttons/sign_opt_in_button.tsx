import { SyntheticEvent, useState } from "react"
import { useWalletContext } from "../../contexts/WalletContext"
import { signOptIn } from "../../blockin-helpers/sign_opt_in"

export const SignOptInButton = ({ asset, onConfirm }: { asset: string, onConfirm: () => Promise<void> }) => {
    const { connector } = useWalletContext();
    const [resourceOptedIn, setResourceOptedIn] = useState(false);
    const [waiting, setWaiting] = useState(false);

    const createAndSignOptIn = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (connector == undefined) {
            console.log("Failed to call signAssetCreateTxn because connector is undefined")
            return;
        }
        setWaiting(true);
        await signOptIn(connector, asset);
        setWaiting(false);

        setResourceOptedIn(true);
        onConfirm();
    }

    return <>
        <button type='submit' onClick={createAndSignOptIn}>
            Opt In to Asset {asset}
        </button>
        {waiting && <p>Awaiting signature and confirmation of opt-in transaction...</p>}
        {resourceOptedIn &&
            <>
                <p>You have successfully opted in to receive asset with ID: {asset}!</p>
            </>
        }
    </>
}