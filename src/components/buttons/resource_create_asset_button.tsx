import { Dispatch, SetStateAction, SyntheticEvent, useState } from "react"
import { useCookies } from "react-cookie"
import { AssetLink } from "../assetLink"
import { useWalletContext } from "../../contexts/WalletContext"

const loadingMessage = <>
    <p>Go to your wallet and accept the challenge request...</p>
</>

const successMessage = <>
    <p>Challenge succeeded!</p>
    <p>You are now authenticated.</p>
    <p>If you specified an asset ID, you should see the banner at the top of this page change colors!</p>
</>

const failureMessage = <>
    <p>Challenge failed!</p>
    <p>You are NOT authenticated</p>
</>


export const ResourceCreateAssetButton = ({ asset, setAsset }: { asset: string, setAsset: Dispatch<SetStateAction<string>> }) => {
    const { connector } = useWalletContext();
    const [resourceAddress, setResourceAddress] = useState('');
    const [resourceMetadata, setResourceMetadata] = useState('');
    const [creatingAsset, setCreatingAsset] = useState(false);

    const resourceCreateAsset = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (connector == undefined) {
            console.log("Failed to call signAssetCreateTxn because connector is undefined")
            return;
        }

        setCreatingAsset(true);
        const res = await fetch('../api/getToken')
            .then(res => res.json())
            .then(data => {
                setResourceAddress(data.address);
                setAsset(data.assetId);
                setResourceMetadata(data.metadata);
            })
            .catch(err => {
                console.log("ERROR:", err)
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