# VEIL — Private Feedback Protocol

**Your opinion. Your privacy.**

VEIL is a privacy-preserving feedback protocol built on the Midnight blockchain. It enables organizations to collect trustworthy feedback while participants prove their eligibility and one-time participation without exposing their individual responses.

## Initial Product Idea (Level 1)
VEIL solves the problem of anonymous but verifiable feedback. By utilizing Midnight's zero-knowledge proofs, participants can cryptographically prove they are eligible to submit a review (and that they haven't submitted one previously) while keeping their exact feedback completely private. The organization only sees aggregate metadata and verifiable proofs of participation, solving the classic tradeoff between Sybil resistance and absolute privacy.

## Privacy Model: Public State vs Private Witness
- **Public State:** The Midnight ledger publicly stores the `participationCount` (aggregate number of responses) and a map of `nullifiers` (to prevent duplicate submissions). Observers can see *that* a valid submission occurred, but not *what* it contained.
- **Private Witness:** The actual feedback text and the user's specific eligibility secret are stored securely as a private witness. These are used locally by the client to generate the ZK proof but are **never** exposed to the blockchain ledger.

## Setup Instructions
1. Ensure you have Node v22, Docker, and the Midnight Compact compiler installed.
2. Clone this repository.
3. To start the Midnight local devnet and deploy the smart contract, navigate to `mn-demo/` and run:
   ```bash
   npm install
   npm run setup
   ```
4. To start the Next.js frontend, navigate to `frontend/` and run:
   ```bash
   npm install
   npm run dev
   ```
5. Open `http://localhost:3000` to interact with the VEIL protocol.
