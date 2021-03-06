import { SyntheticEvent, useState } from "react"
import { useAlgorandContext } from "../../chain_handlers_frontend/algorand/AlgorandContext"
import { signAssetCreateTxn } from "../../chain_handlers_frontend/algorand/smartcontract-helpers/sign_asset_create_txn"

export const UserCreatesForm = ({ updateOwnedAssets }: { updateOwnedAssets: () => Promise<void> }) => {
    const { connector } = useAlgorandContext();
    const [creatingAsset, setCreatingAsset] = useState(false);
    const [createdAsset, setCreatedAsset] = useState(false);
    const [metadata, setMetadata] = useState('');

    const userCreateAsset = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (connector == undefined) {
            console.log("Failed to call signAssetCreateTxn because connector is undefined")
            return;
        }

        setCreatingAsset(true);
        await signAssetCreateTxn(connector, metadata);

        updateOwnedAssets();
        setCreatingAsset(false);
        setCreatedAsset(true);
    }

    return <>
        <div className='assetidinput'>
            <input value={metadata} type="text" placeholder='Add Color' onChange={e => setMetadata(e.target.value)} />
        </div>
        <p>*For a list of supported color names, <a className='asset-link' href="https://www.w3schools.com/tags/ref_colornames.asp" target="_blank" rel="noreferrer">click here</a>.</p>

        <button type='submit' onClick={userCreateAsset}>Generate New Asset (User Creates)</button>
        {creatingAsset && <p>Please go to your wallet and sign the transaction. It may take a few seconds for confirmation.</p>}
        {createdAsset && <p>Asset successfully created! You now own this asset in your wallet!</p>}
    </>
}