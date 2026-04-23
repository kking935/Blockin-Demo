import { Dispatch, SetStateAction, SyntheticEvent, useState } from "react"
import { AssetLink } from "../assetLink"
import { useAlgorandContext } from "../../chain_handlers_frontend/algorand/AlgorandContext"

export const ResourceCreateAssetButton = ({ asset, setAsset }: { asset: string, setAsset: Dispatch<SetStateAction<string>> }) => {
    const { connector } = useAlgorandContext();
    const [resourceAddress, setResourceAddress] = useState('');
    const [resourceMetadata, setResourceMetadata] = useState('');
    const [creatingAsset, setCreatingAsset] = useState(false);

    const resourceCreateAsset = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (connector == undefined) {
            return;
        }

        setCreatingAsset(true);
        await fetch('../api/getToken')
            .then(res => res.json())
            .then(data => {
                setResourceAddress(data.address);
                setAsset(data.assetId);
                setResourceMetadata(data.metadata);
            })
            .catch(err => {
                console.error(err);
            })

        setCreatingAsset(false);
    }

    return <>
        <button type='submit' onClick={resourceCreateAsset}>Generate New Asset (Resource Creates)</button>
        {creatingAsset && <p>The authorizing server is currently creating the asset. This may take a couple of seconds.</p>}
        {resourceAddress && <>
            <p style={{ wordBreak: 'break-word' }}>Resource with address {resourceAddress} has just created an asset with an asset ID of{' '}
                <AssetLink assetId={asset} />
                {' '}and metadata of {`'${resourceMetadata}'`}
            </p>
        </>}
    </>;

}