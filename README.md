# Blockin Demo

A reference implementation of [Blockin](https://github.com/matt-davison/blockin) — a library for on-chain role-based access control using NFTs as authorization tokens.

This demo shows the full Blockin flow against **Algorand** (testnet) and **Ethereum / Polygon / BSC / Avalanche** (mainnet), including:

- Creating authorization assets on-chain
- Signing a challenge with a connected wallet
- Verifying ownership of the asset via blockchain lookup
- Granting access to a gated resource for the duration the asset is held

> **Status: archival.** This demo was built in 2022 against Algorand's Purestake API and Moralis v1. Purestake's API was shut down in December 2023 and Moralis v1 is deprecated, so the live flow no longer runs without a dependency refresh. The code is preserved as a reference for the Blockin protocol pattern.

## How it works

Blockin defines a two-step flow:

1. **Authorization** — a resource provider issues an on-chain asset (an Algorand ASA or an ERC-20/721) that represents access to something. Ownership of the asset = permission.
2. **Authentication** — when a user requests access, the server issues a signed challenge. The user signs it with the wallet that holds the asset. The server verifies the signature, then queries the chain to confirm the signer still owns the asset.

Everything chain-specific lives behind a `ChainDriver` interface, so the same Blockin library runs on any chain with a driver implementation (this demo uses `blockin-algo-driver` and `blockin-eth-driver`).

## Repository layout

```
src/
├── pages/
│   ├── index.tsx              # Main UI: wallet connect, challenge flow, asset demos
│   └── api/                   # Simulated resource provider backend
│       ├── getChallenge.ts         # Issues a challenge
│       ├── verifyChallenge.ts      # Verifies signature + on-chain ownership
│       ├── getAssets.ts            # Queries assets held by address
│       └── ...                     # Asset creation, opt-in, transfer
├── chain_handlers_frontend/   # Wallet + signing per chain
│   ├── algorand/                   # WalletConnect + Algorand signing
│   └── ethereum/                   # Web3Modal + EIP-191 signing
└── components/                # UI (React)
```

The `src/pages/api/` folder simulates a resource provider's backend. In a real deployment this would be a separate service — the demo colocates them for convenience.

## Running locally

Requires Node 16+.

```bash
npm install
cp .env.example .env
# Fill in real values (see note below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Environment variables** (see `.env.example`):

| Variable | Purpose |
|---|---|
| `RESOURCE_PASSPHRASE` | 25-word Algorand mnemonic for the simulated resource account |
| `ALGO_API_URL` / `ALGO_API_KEY` | Algorand node + indexer access (Purestake-style; replace with Nodely or similar) |
| `NEXT_PUBLIC_LOCAL_CONTRACT_ID` | Deployed Blockin smart contract app ID (testnet) |
| `NEXT_PUBLIC_GLOBAL_CONTRACT_ID` | Deployed Blockin smart contract app ID (testnet) |
| `MORALIS_*` | Moralis v1 credentials for EVM queries |
| `NEXT_PUBLIC_INFURA_ID` | Infura project ID for WalletConnect |

## Stack

Next.js 12 · React 18 · TypeScript · WalletConnect v1 · Web3Modal · algosdk · ethers v5 · Moralis v1

## License

MIT — see [LICENSE](LICENSE).
