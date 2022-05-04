import { useState } from "react"
import { useCookies } from "react-cookie"
import { useWalletContext } from "../../contexts/WalletContext"
import { signChallenge } from "../../blockin-walletconnect-helpers/sign_challenge"

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


export const SignChallengeButton = ({ challenge, cookieValue }: { challenge: string, cookieValue: string }) => {
    const [userIsSigningChallenge, setUserIsSigningChallenge] = useState(false);
    const [displayMessage, setDisplayMessage] = useState(loadingMessage);
    const { connector } = useWalletContext();
    const [cookies, setCookie] = useCookies(['blockedin']);

    const handleSignChallenge = async () => {
        setUserIsSigningChallenge(true);
        setDisplayMessage(loadingMessage);

        if (connector != undefined) {
            const response = await signChallenge(connector, challenge);
            alert(response);

            if (response.startsWith('Error')) {
                setDisplayMessage(failureMessage);
                setUserIsSigningChallenge(false)
            }
            else {
                setDisplayMessage(successMessage);
                setCookie('blockedin', cookieValue, { 'path': '/' });
            }
        }
    }

    return <>
        <button disabled={!challenge} onClick={handleSignChallenge}> {
            userIsSigningChallenge ?
                <>
                    Resend Challenge
                </> :
                <>
                    Sign Challenge to Log In
                </>
        }
        </button>

        {userIsSigningChallenge && displayMessage}
    </>;
}