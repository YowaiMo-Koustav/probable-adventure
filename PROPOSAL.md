# Product Proposal

## What is the product, and who uses it?
The product is a **Private Secret Santa** application. It is used by families, friends, or remote teams who want to organize a gift exchange. The application allows users to register themselves and securely verify their randomly assigned "giftee" on-chain, without revealing the assignment to anyone else (not even the organizer).

## Why Midnight specifically?
Midnight is the perfect fit because of its robust data protection capabilities. On a transparent chain like Ethereum, storing assignment data on-chain would either reveal everyone's Secret Santa assignment to the world, or require complex off-chain cryptographic setups and central coordinators. Midnight's ZK-proofs allow us to naturally verify on-chain that all pairings are valid participants, without actually revealing who gives to whom.

## Data Model
| Data Point             | Type            | Disclosed To |
|------------------------|-----------------|--------------|
| Wallet Address / User  | Public ledger   | Everyone     |
| Received Assignment    | Public ledger   | Everyone     |
| Assigned To (Giftee)   | Private witness | No one       |

## Mainnet Feasibility
This product is highly realistic for Mainnet. It showcases a core use-case of data protection: blind verifiable assignments. The logic is simple, doesn't require high-frequency low-latency updates, and targets a common social use-case that directly benefits from privacy guarantees.
