# How to Use Private Secret Santa

## What You Need
- A modern web browser.
- The **Lace wallet** browser extension installed.
- DUST/tNIGHT tokens to pay for transaction fees on the Preprod network.

## Step-by-Step Guide
1. **Connect Wallet:** Click the "Connect Lace Wallet" button on the main page to securely connect your Midnight wallet.
2. **Register:** Click "Register Participant" to add your address to the public Secret Santa roster.
3. **Receive Assignment:** In a real setting, an off-chain pairing algorithm or an organizer would generate your assignment. Once you receive your assignment address, paste it into the "Assigned To" box and click "Prove Assignment".
4. **Zero-Knowledge Proof:** The application will generate a ZK-proof locally in your browser. It proves to the smart contract that your assigned person is a valid participant without revealing their address. 
5. **Success:** Your status will be updated on the public ledger, confirming you have received a valid assignment!

## What Gets Proved (and What Stays Private)
- **Proved:** You are registered, and you received a valid assignment.
- **Stays Private:** The exact wallet address of the person you are assigned to give a gift to.

## Troubleshooting
- **Wallet Not Connecting:** Ensure your Lace wallet extension is active and set to the Preprod network.
- **Proof Generation Fails:** Ensure the address you entered in the assignment box is a valid, registered participant's address.
