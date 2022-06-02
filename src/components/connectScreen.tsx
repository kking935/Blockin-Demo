import { connect } from "../chain_handlers_frontend/algorand/WalletConnect"
import { useChainContext } from "../chain_handlers_frontend/ChainContext"

import { useEffect, useState } from "react"
import { CloseIcon, LoginIcon } from "./icons";
import { useAlgorandContext } from "../chain_handlers_frontend/algorand/AlgorandContext";

const ConnectScreen = () => {
    const { address, setAddress } = useChainContext();
    const { setConnector } = useAlgorandContext();
    const [popup, setPopup] = useState(false)

    const delay = 1

    useEffect(() => {
        let timer1 = setTimeout(() => {
            if (address != '') {
                setPopup(false)
            }
            else {
                setPopup(true)
            }
        }, delay * 1000);

        // this will clear Timeout
        // when component unmount like in willComponentUnmount
        // and show will not change to true
        return () => {
            clearTimeout(timer1);
        };
    }, [address])

    return (
        <section className={`${popup ? 'connect-screen' : 'hidden'}`}>
            <div>
                <button onClick={() => setPopup(false)} className="closeButton"><CloseIcon /></button>
                <h1>You must connect your wallet to get started</h1>
                <button className="connectButton" onClick={() => connect(setConnector, setAddress)}><LoginIcon /> Connect Wallet</button>
            </div>
        </section>
    )
}

export default ConnectScreen