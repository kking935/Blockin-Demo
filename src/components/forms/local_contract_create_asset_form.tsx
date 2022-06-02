import { SyntheticEvent, useState } from "react"
import { useAlgorandContext } from "../../chain_handlers_frontend/algorand/AlgorandContext"

export const LocalContractCreatesForm = ({contractId, setAssetId}: {contractId: string, setAssetId: React.Dispatch<React.SetStateAction<string>>}) => {
    const { connector } = useAlgorandContext();
    const [creatingAsset, setCreatingAsset] = useState(false);
    const [createdAsset, setCreatedAsset] = useState(false);
    const [metadata, setMetadata] = useState('');

    const createAsset = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (connector == undefined) {
            console.log("Failed to call signAssetCreateTxn because connector is undefined")
            return;
        }

        setCreatingAsset(true);
        const data = await fetch('../api/localContractCreateAsset', {
            method: 'post',
            body: JSON.stringify({
                address: connector.accounts[0],
                contractId: contractId,
                metaData: metadata
            }),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json())
            .then(data => {
                console.log("response data")
                console.log(data)
                setAssetId(data.assetId);
            })
            .catch(err => {
                console.log("ERROR:", err)
            })
        setCreatingAsset(false);
        setCreatedAsset(true);
    }

    return <>
        <div className='assetidinput'>
            <input value={metadata} type="text" placeholder='Add Color' onChange={e => setMetadata(e.target.value)} />
        </div>
        <p>*For a list of supported color names, <a className='asset-link' href="https://www.w3schools.com/tags/ref_colornames.asp" target="_blank" rel="noreferrer">click here</a>.</p>

        <button type='submit' onClick={createAsset}>Generate New Asset (Contract Creates)</button>
        {creatingAsset && <p>The resource is calling the smart contract to make the asset. It may take a few seconds for confirmation.</p>}
        {createdAsset && <p>Asset successfully created! You may now retrieve it!</p>}
    </>
}