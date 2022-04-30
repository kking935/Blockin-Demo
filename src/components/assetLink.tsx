export const AssetLink = ({ assetId, text }: { assetId: string, text?: string }) => {
    return <a className='asset-link' href={`https://testnet.algoexplorer.io/asset/${assetId}`} target="_blank" rel="noreferrer">
        {text ? text : assetId}
    </a>
}