import { SyntheticEvent, useState } from "react"
import { useWalletContext } from "../../contexts/WalletContext"
import { signContractNoOp } from "../../blockin-walletconnect-helpers/sign_contract_no_op"

export const LocalContractRetrieveAssetButton = ({ contractId, assetId, updateAssets }: { contractId: string, assetId: string, updateAssets: () => Promise<void> }) => {
    const { connector } = useWalletContext();
    const [retrievingAsset, setRetrievingAsset] = useState(false);
    const [retrievedAsset, setRetrievedAsset] = useState(false);

    const createAndSignContractNoOp = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (connector == undefined) {
            console.log("Failed to call signAssetCreateTxn because connector is undefined")
            return;
        }
        setRetrievingAsset(true);
        const res = await signContractNoOp(connector, contractId, assetId)
        
        setRetrievingAsset(false);
        setRetrievedAsset(true);
        updateAssets();
    }

    return <>
        <button type='submit' onClick={createAndSignContractNoOp}>
            Retrieve Asset from Contract {contractId}
        </button>
        {retrievingAsset && <p>Awaiting signature and confirmation of no-op transaction...</p>}
        {retrievedAsset &&
            <>
                <p>You have successfelly retrieved asset with ID: {assetId} from contract: {contractId}!</p>
            </>
        }
    </>
}