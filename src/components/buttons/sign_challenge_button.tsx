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
    <p>If you specified an asset ID, you should see the banner at the top of this page change colors!</p>
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
        name: 'Default',
        // displayedAssets: [],
        displayedAssets: assets.map(id => {
            console.log(id);
            return { assetId: `Asset ID: ${id}`, name: `Asset ID: ${id}`, frozen: false, defaultSelected: true, description: 'User has added an Algorand asset with ID: ' + id }
        }),
        displayedUris: [{
            uri: 'https://blockin.com/striped',
            name: 'Striped Banner',
            defaultSelected: false,
            frozen: false,
            description: 'You will see a striped banner at the top of the page.'
        },
        {
            uri: 'https://blockin.com/gradient',
            name: 'Gradient Banner',
            defaultSelected: false,
            frozen: false,
            description: 'You will see a gradient banner at the top of the page.'
        },],
    });

    const handleSignChallenge = async (challenge: string) => {
        setUserIsSigningChallenge(true);
        setDisplayMessage(loadingMessage);
        setChallengeString(challenge);
        console.log("CHALLENGE STRING", challenge)

        if (connector != undefined) {
            const response = await signChallenge(connector, challenge, chainProps.name === 'Algorand Testnet');
            return response;
        } else {
            return { message: 'Error: Error with signature response.', signatureBytes: new Uint8Array(0), originalBytes: new Uint8Array(0) };
        }
    }

    const handleVerifyChallenge = async (originalBytes: Uint8Array, signatureBytes: Uint8Array, challengeObj: ChallengeParams) => {
        const verificationResponse = await verifyChallengeOnBackend(originalBytes, signatureBytes);

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
                        name: 'Algorand Testnet',
                        // displayedAssets: [],
                        displayedAssets: assets.map(id => {
                            console.log(id);
                            return { assetId: id, name: `Asset ID: ${id}`, frozen: false, defaultSelected: true, description: 'User has added an Algorand asset with ID: ' + id }
                        }),
                        displayedUris: [{
                            uri: 'https://blockin.com/striped',
                            name: 'Striped Banner',
                            defaultSelected: false,
                            frozen: false,
                            description: 'You will see a striped banner at the top of the page.'
                        },
                        {
                            uri: 'https://blockin.com/gradient',
                            name: 'Gradient Banner',
                            defaultSelected: false,
                            frozen: false,
                            description: 'You will see a gradient banner at the top of the page.'
                        },],
                        currentChainInfo: undefined,
                        signChallenge: handleSignChallenge
                    },
                    {
                        name: 'Algorand Mainnet',
                        displayedAssets: assets.map(id => {
                            return { assetId: `Asset ID: ${id}`, name: `Asset ID: ${id}`, frozen: false, defaultSelected: true, description: 'User has added an Algorand asset with ID: ' + id }
                        }),
                        // displayedAssets: [],
                        displayedUris: [{
                            uri: 'https://blockin.com/striped',
                            name: 'Striped Banner',
                            defaultSelected: false,
                            frozen: false,
                            description: 'You will see a striped banner at the top of the page.'
                        },
                        {
                            uri: 'https://blockin.com/gradient',
                            name: 'Gradient Banner',
                            defaultSelected: false,
                            frozen: false,
                            description: 'You will see a gradient banner at the top of the page.'
                        },],
                        currentChainInfo: undefined,
                        signChallenge: handleSignChallenge
                    }
                ]}
                updateChain={(newChainProps: ChainProps) => { setChainProps(newChainProps) }}
            />
            {challengeParams &&
                <SignInWithBlockinButton
                    challengeParams={constructChallengeObjectFromString(challengeParams ? challengeParams : '')}
                    currentChain={chainProps.name}
                    displayedAssets={chainProps.displayedAssets ? chainProps.displayedAssets : []}
                    displayedUris={chainProps.displayedUris ? chainProps.displayedUris : []}
                    signChallenge={challengeParams ? handleSignChallenge : async () => {
                        return {
                            message: 'Failed to sign challenge. Challenge not generated yet'
                        }
                    }}
                    verifyChallengeOnBackend={handleVerifyChallenge}
                />
            }
        </div>

        {userIsSigningChallenge && displayMessage}
    </>;
}