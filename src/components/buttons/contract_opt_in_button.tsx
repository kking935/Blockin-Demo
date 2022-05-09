import { SyntheticEvent, useState } from "react"
import { useWalletContext } from "../../contexts/WalletContext"
import { signContractOptIn } from "../../blockin-walletconnect-helpers/sign_contract_opt_in"

export const ContractOptInButton = ({ contractId, onConfirm }: { contractId: string, onConfirm: () => Promise<void> }) => {
    const { connector } = useWalletContext();
    const [contractOptedIn, setContractOptedIn] = useState(false);
    const [waiting, setWaiting] = useState(false);

    const createAndSignContractOptIn = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (connector == undefined) {
            console.log("Failed to call signAssetCreateTxn because connector is undefined")
            return;
        }
        setWaiting(true);
        await signContractOptIn(connector, contractId);
        setWaiting(false);

        setContractOptedIn(true);
        onConfirm();
    }

    return <>
        <button type='submit' onClick={createAndSignContractOptIn}>
            Opt In to Contract {contractId}
        </button>
        {waiting && <p>Awaiting signature and confirmation of opt-in transaction...</p>}
        {contractOptedIn &&
            <>
                <p>You have successfully opted in to the contract with ID: {contractId}!</p>
            </>
        }
    </>
}