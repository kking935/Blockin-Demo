import { connect } from "../wallet/connect"
import { useWalletContext } from "../contexts/WalletContext"

const ConnectScreen = () => {
    const { connector, setConnector } = useWalletContext()

    const handleConnect = () => {
      const connector = connect()
      setConnector(connector)
    }

    return (
        <section className={`${connector?.connected? 'hidden' : 'connect-screen'}`}>
            <div>
                <h1>You must connect your wallet to get started</h1>
                <button onClick={handleConnect}>Connect Wallet</button>
            </div>
        </section>
    )
}

export default ConnectScreen