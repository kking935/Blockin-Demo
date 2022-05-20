import { useState } from "react"
import { useCookies } from "react-cookie"
import { useWalletContext } from "../../contexts/WalletContext"
import { signChallenge, verifyChallengeOnBackend } from "../../blockin-walletconnect-helpers/sign_challenge"
import { ChainSelect, SignInWithBlockinButton } from 'blockin/dist/ui';
import { VerifyChallengeOnBackendRequest, constructChallengeObjectFromString } from 'blockin';

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


export const SignChallengeButton = ({ challenge, cookieValue, assets }: { challenge: string, cookieValue: string, assets: string[] }) => {
    const [userIsSigningChallenge, setUserIsSigningChallenge] = useState(false);
    const [displayMessage, setDisplayMessage] = useState(loadingMessage);
    const { connector } = useWalletContext();
    const [cookies, setCookie] = useCookies(['blockedin', 'stripes', 'gradient']);

    const handleSignChallenge = async () => {
        setUserIsSigningChallenge(true);
        setDisplayMessage(loadingMessage);

        if (connector != undefined) {
            const response = await signChallenge(connector, challenge);
            return response;
        } else {
            return { message: 'Error: Error with signature response.', signatureBytes: new Uint8Array(0), originalBytes: new Uint8Array(0) };
        }
    }

    const handleVerifyChallenge = async (signChallengeResponse: VerifyChallengeOnBackendRequest) => {
        if (!signChallengeResponse.originalBytes || !signChallengeResponse.signatureBytes) {
            return { success: false, message: `${signChallengeResponse.message}` }
        }

        const verificationResponse = await verifyChallengeOnBackend(signChallengeResponse);

        console.log(verificationResponse);
        if (!verificationResponse.verified) {
            setDisplayMessage(failureMessage);
            setUserIsSigningChallenge(false);
            return { success: false, message: `${verificationResponse.message}` }
        }
        else {
            setDisplayMessage(successMessage);
            setCookie('blockedin', cookieValue, { 'path': '/' });
            setCookie('stripes', true, { 'path': '/' })
            setCookie('gradient', true, { 'path': '/' })
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
                        displayedAssets: [],
                        displayedUris: [],
                        currentChainInfo: undefined,
                        signChallenge: handleSignChallenge
                    }
                ]}
                updateChain={async () => { }}
            />
            {challenge &&
                <SignInWithBlockinButton
                    challengeParams={constructChallengeObjectFromString(challenge ? challenge : '')}
                    currentChain={'Algorand Testnet'}
                    displayedAssets={[]}
                    displayedUris={[{
                        uri: 'https://blockin.com/striped', name: 'Striped Banner', frozen: false, defaultSelected: false, description: 'If selected, you will be able to view a striped banner at the top of the page while browsing this website.',
                    },
                    {
                        uri: 'https://blockin.com/gradient', name: 'Gradient Banner', frozen: false, defaultSelected: false, description: 'If selected, you will be able to view a gradient banner at the top of the page while browsing this website.'
                    }]}

                    signChallenge={challenge ? handleSignChallenge : async () => {
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