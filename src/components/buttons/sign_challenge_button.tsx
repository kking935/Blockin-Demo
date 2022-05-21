import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { useWalletContext } from "../../contexts/WalletContext"
import { signChallenge, verifyChallengeOnBackend } from "../../blockin-walletconnect-helpers/sign_challenge"
import { ChainSelect, SignInWithBlockinButton } from 'blockin/dist/ui';
import { SignChallengeResponse, constructChallengeObjectFromString, ChainProps, ChallengeParams } from 'blockin';

const loadingMessage = <>
    <p>Go to your wallet and accept the challenge request...</p>
</>

const successMessage = <>
    <p>Challenge succeeded!</p>
    <p>You are now authenticated.</p>
    <p>If you specified a banner privilege, you should see the banner at the top of this page change!</p>
</>

const failureMessage = <>
    <p>Challenge failed!</p>
    <p>You are NOT authenticated</p>
</>


export const SignChallengeButton = ({ challengeParams, cookieValue, assets }: { challengeParams: string, cookieValue: string, assets: string[] }) => {
    const [userIsSigningChallenge, setUserIsSigningChallenge] = useState(false);
    const [displayMessage, setDisplayMessage] = useState(loadingMessage);
    const { connector } = useWalletContext();
    const [challengeString, setChallengeString] = useState('');
    const [cookies, setCookie] = useCookies(['blockedin', 'stripes', 'gradient']);
    const [chainProps, setChainProps] = useState<ChainProps>({
        name: 'Default'
    });

    const [assetsDisplayed, setAssetsDisplayed] = useState(assets ? assets.map((elem: any) => {
        console.log(elem);
        return { assetId: elem['asset-id'], name: `Algorand Testnet Asset ID: ${elem['asset-id']}`, frozen: false, defaultSelected: false, description: `${elem['color']} Banner` }
    }) : []);

    useEffect(() => {
        setAssetsDisplayed(assets.map((elem: any) => {
            console.log(elem);
            return { assetId: elem['asset-id'], name: `Algorand Testnet Asset ID: ${elem['asset-id']}`, frozen: false, defaultSelected: false, description: `${elem['color']} Banner` }
        }));
    }, [assets])


    const handleSignChallenge = async (challenge: string) => {
        setUserIsSigningChallenge(true);
        setDisplayMessage(loadingMessage);
        setChallengeString(challenge);
        console.log("CHALLENGE STRING", challenge)

        if (chainProps.name === 'Simulated') {
            return { signatureBytes: new Uint8Array(32), originalBytes: new Uint8Array(32) }
        }
        if (connector != undefined) {
            const response = await signChallenge(connector, challenge, chainProps.name === 'Algorand Testnet');
            return response;
        } else {
            return { message: 'Error: Error with signature response.', signatureBytes: new Uint8Array(0), originalBytes: new Uint8Array(0) };
        }
    }

    const handleVerifyChallenge = async (originalBytes: Uint8Array, signatureBytes: Uint8Array, challengeObj: ChallengeParams) => {
        const verificationResponse = chainProps.name !== 'Simulated' ? await verifyChallengeOnBackend(originalBytes, signatureBytes) : { verified: true, message: 'Successfully verified!' };

        if (!verificationResponse.verified) {
            setDisplayMessage(failureMessage);
            setUserIsSigningChallenge(false);
            return { success: false, message: `${verificationResponse.message}` }
        }
        else {
            setDisplayMessage(successMessage);
            setCookie('blockedin', cookieValue, { 'path': '/' });

            if (challengeObj.resources) {
                console.log(challengeObj);
                for (const resource of challengeObj.resources) {
                    console.log(resource);
                    if (resource === 'https://blockin.com/striped') {
                        setCookie('stripes', true, { 'path': '/' })
                    }
                    if (resource === 'https://blockin.com/gradient') {
                        setCookie('gradient', true, { 'path': '/' })
                    }
                }
            }
        }

        alert(verificationResponse.message);

        return {
            success: true, message: `${verificationResponse.message}`
        }
    }

    return <>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ChainSelect
                chains={[

                    {
                        name: 'Simulated'
                    },
                    {
                        name: 'Algorand Testnet',
                    },
                    {
                        name: 'Algorand Mainnet',
                    },
                ]}
                updateChain={(newChainProps: ChainProps) => { setChainProps(newChainProps) }}
            />
            {challengeParams &&
                <SignInWithBlockinButton
                    challengeParams={constructChallengeObjectFromString(challengeParams ? challengeParams : '')}
                    currentChain={chainProps.name}
                    displayedAssets={chainProps.name === 'Algorand Tesnet' ? assetsDisplayed : []}
                    displayedUris={[{
                        uri: 'https://blockin.com/striped',
                        name: 'Striped Banner',
                        defaultSelected: false,
                        frozen: false,
                        description: 'If selected, you will see a striped banner at the top of the page upon signing-in.'
                    },
                    {
                        uri: 'https://blockin.com/gradient',
                        name: 'Gradient Banner',
                        defaultSelected: false,
                        frozen: false,
                        description: 'If selected, you will see a gradient banner at the top of the page upon signing-in.'
                    }]}
                    signChallenge={challengeParams ? handleSignChallenge : async () => {
                        return {
                            message: 'Failed to sign challenge. Challenge not generated yet'
                        }
                    }}
                    verifyChallengeOnBackend={handleVerifyChallenge}
                    canAddCustomAssets={true}
                />
            }
        </div>

        {userIsSigningChallenge && displayMessage}
    </>;
}