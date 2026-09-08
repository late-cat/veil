# 🌑 VEIL — Private Feedback Protocol
[![VEIL CI Pipeline](https://github.com/bapi/new-moon-stellar/actions/workflows/ci.yml/badge.svg)](https://github.com/bapi/new-moon-stellar/actions/workflows/ci.yml)

**Your opinion. Your privacy.**

VEIL is a privacy-preserving feedback protocol built on the **Midnight blockchain**. It enables organizations to collect trustworthy feedback while participants mathematically prove their eligibility and one-time participation *without* exposing their individual responses publicly. 

## Live Demo & Contract
- **Live Demo**: [localhost:3000 (Local Devnet / Next.js)](http://localhost:3000)
- **Contract Address (Midnight Preprod)**: `TBD_ON_PREPROD_DEPLOY`
- **Product Proposal**: Read our official [Level 3 Proposal here](./PROPOSAL.md).

## Why Midnight?
Traditional surveys force users to trust the organization not to look at backend logs. VEIL changes the paradigm by separating the **Proof** from the **Data**. Midnight provides the Zero-Knowledge infrastructure to prove that a submission is legitimate and unique, while allowing us to store the sensitive long-form data entirely off-chain.

## Privacy Model
VEIL utilizes a "Selective Disclosure" architecture:
- **What is Public?** The total `participationCount` and a `Set` of anonymous cryptographic `nullifiers` used to prevent double-voting.
- **What is Private?** The participant's identity (wallet address) and the raw feedback text.
- **What is Proven?** That the participant was eligible, they hadn't submitted yet, and their feedback is securely linked to the nullifier.

## Technical Architecture
1. **Frontend**: Next.js App Router featuring a "Million Dollar" elegant light aesthetic (Neumorphism / Glassmorphism) with custom Vanilla CSS.
2. **Blockchain Layer**: Midnight `Compact` smart contract (`contracts/survey.compact`).
3. **Database Layer**: Vercel Postgres Mock (`api/feedback`) storing encrypted off-chain data.
4. **Wallet**: Integration with Lace via the Midnight SDK (`providers/MidnightProvider.tsx`).

## Setup Instructions
1. **Requirements**: Node.js v22.x, Docker, Midnight Compact compiler.
2. **Start the Blockchain Network**:
   ```bash
   cd mn-demo
   npm install
   npm run setup
   ```
3. **Start the Application**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
4. Open `http://localhost:3000` to interact with VEIL.

## Testing & CI/CD
This project features a complete GitHub Actions CI/CD pipeline (`.github/workflows/ci.yml`) that automatically compiles the Compact circuit, runs the 10-test suite verifying the Nullifier Map logic, and builds the Next.js frontend on every push.

Run tests locally:
```bash
cd mn-demo
npm run test:e2e
```
