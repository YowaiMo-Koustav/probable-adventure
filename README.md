# Midnight Builder Challenge - Level 1

This repository contains my solution to Level 1 of the Midnight Builder Challenge. It features a zero-knowledge Counter Smart Contract written in Compact for the Midnight Network.

## Initial Product Idea: Private Secret Santa
My initial product idea is a **Private Secret Santa** application. Participants can register for a gift exchange event on-chain. The assignments (who gives a gift to whom) are computed and verified on-chain using zero-knowledge proofs, meaning nobody's assignment is revealed to the public or to the central organizer. The public ledger only stores the list of participants and whether they have securely received their assignment, while the actual pairing is kept entirely private as a witness.

## Public State vs Private Witness
In Midnight, applications have a fundamental separation between what is public and what is private:
- **Public State (`ledger`)**: Variables defined in the `ledger` block are visible to everyone on the network.
- **Private Witness**: The `witness` (or arguments passed to a circuit) represents private user data. This data never leaves the user's local machine.
- **The `disclose()` function**: We use `disclose()` deliberately inside circuits to explicitly move data from the private domain into the public ledger. By default, everything remains private unless `disclose()` is explicitly called.

## Setup Instructions (How to run locally)

### Prerequisites
- [Node.js v22](https://nodejs.org/)
- [Docker](https://www.docker.com/) (for the local proof server)
- [Compact CLI](https://docs.midnight.network/develop/tutorial/building/prereqs#install-the-compact-compiler)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Local Proof Server
Start the local Midnight proof server using Docker:
```bash
docker compose up -d
```

### 3. Compile the Contract
Compile the Compact smart contract to generate the ZK circuits and keys in the `contracts/managed/` directory:
```bash
npm run compile
```

### 4. Run Tests
Execute the test suite to verify circuit logic, state transitions, and private input isolation:
```bash
npx tsx tests/counter.test.ts
```

### 5. Deploy to Local Devnet
Deploy the contract to the local undeployed network:
```bash
npm run deploy
```

## Deployment Details
- **Network deployed to:** Midnight Preview Network (`preview`)
- **Deployed Contract Address:** `b0c5e3eb4214be84f54073325da8ee7eaf249ad87e1b607ab649cf8f13bb4b28`
- **Wallet Address used:** `mn_addr_preview19sxp7qv8ee3n9fpkntw40f80kyanqnxg4842xhg57utq49kpssfqyy3q5t`
