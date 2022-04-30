import { AssetLink } from "./assetLink";

interface Asset {
    color: string;
    amount: number;
    'asset-id': string;
}

export const AssetList = ({ assetIds, addToChallenge }: { assetIds: Asset[], addToChallenge?: (assetId: string) => Promise<void> }) => {
    return <ul>
        {assetIds.map((elem, idx) => {
            if (elem['amount'] <= 0) return;

            return <li key={elem['asset-id']}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <AssetLink assetId={elem['asset-id']} /> {' '} ({elem['color']} Banner)
                    </div>
                    {addToChallenge && <button type='submit' onClick={async () => await addToChallenge(elem['asset-id'])}>Add to Challenge</button>}
                </div>
            </li>
        })}
    </ul>
}

export const AssetIdList = ({ assetIds, signInColor }: { assetIds: string[], signInColor?: string }) => {
    return <ul>
        {assetIds.map((elem, idx) => {
            return <div key={elem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <li ><div>
                    <AssetLink assetId={elem} />{' '}{idx == 0 && <>({signInColor ? signInColor : 'Custom'} Banner)</>}
                </div></li>
            </div>
        })}
    </ul>
}