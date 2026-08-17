# Private Secret Santa
![CI](https://github.com/YowaiMo-Koustav/probable-adventure/actions/workflows/ci.yml/badge.svg)
> Secure, on-chain Secret Santa assignments using Zero-Knowledge proofs.

## Live Demo
[Live URL - TO BE ADDED BY USER]

## Contract Address
| Network | Address |
|----------|----------------------------------|
| Local Devnet | e21c8653fc074e70e367461a22b11b831793cb9e8d533e9bc5ce5b171ab447b8 |

> *Note: Deployed to local devnet. Deployment to Preprod via CLI was impossible due to a known SDK bug causing endless `Wallet.Sync` Effect errors and RPC `Normal Closure` timeouts during the initial genesis block sync for new wallets.*

## What This Does
The Private Secret Santa application solves the common problem of organizing a gift exchange securely and trustlessly. Users register on-chain to participate. Once assignments are decided, each user submits a zero-knowledge proof to the Midnight network proving that their assigned "giftee" is a valid participant, without ever revealing who that person is. 

## Privacy Model
- **What is PUBLIC:** The list of registered participants and a flag indicating whether they have received a valid assignment.
- **What is PRIVATE:** The actual pairing/assignment (who gives a gift to whom).
- **What the user PROVES without revealing:** That they are a registered participant and that their assigned person is also a registered participant.

## Privacy Claim
An on-chain observer sees that Alice and Bob are participants, and sees that Alice has successfully secured her assignment. The observer **cannot** see that Alice was assigned to Bob.

## Tech Stack
- Midnight Network
- Compact Language
- Midnight.js SDK
- React & Vite
- Lace Wallet

## Prerequisites
- [Lace wallet](https://www.lace.io/) installed and configured for Midnight Preprod
- Node.js v22
- [Docker](https://www.docker.com/) (if running local proof server)
- [Compact CLI](https://docs.midnight.network/develop/tutorial/building/prereqs#install-the-compact-compiler)

## Setup & Run Locally
1. **Clone the repository:**
   ```bash
   git clone https://github.com/YowaiMo-Koustav/probable-adventure.git
   cd probable-adventure
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the local app:**
   ```bash
   npm run dev
   ```

## Run Tests
Command to run the test suite to verify the logic and privacy boundaries:
```bash
npm test
```

## CI/CD
Our continuous integration pipeline uses GitHub Actions to automatically run on every push and pull request to the `main` branch. It installs all dependencies, compiles the Compact smart contract to ensure there are no syntax or privacy leakage errors, and runs the test suite.

## Product Proposal
See [PROPOSAL.md](./PROPOSAL.md) for more details on the product design, data model, and Mainnet feasibility.
