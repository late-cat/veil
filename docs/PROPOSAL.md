# 🌑 VEIL — Product Proposal

## The Problem
Organizations (universities, DAOs, corporations) constantly need honest feedback from their constituents. However, participants are often hesitant to provide truthful, critical feedback if they believe their identity might be exposed. Traditional "anonymous" surveys rely purely on trusting the organization's central database administrator not to look at the logs.

## The Solution: VEIL
**VEIL** is a privacy-preserving feedback protocol built on the Midnight Network. It enables organizations to collect trustworthy feedback while participants mathematically prove their eligibility and one-time participation *without* exposing their individual responses publicly.

### How it works
1. **Eligibility Proof**: A user connects their wallet (e.g., Lace) to prove they possess a specific credential or belong to a specific list.
2. **The ZK Circuit**: The user's device locally generates a Zero-Knowledge proof asserting: "I am eligible, and I have not submitted feedback before."
3. **Double Submission Protection**: The smart contract uses a cryptographic "Nullifier Map" to ensure that the user's specific proof can only be submitted once. The nullifier is completely detached from their actual identity.
4. **Selective Disclosure**: The public ledger only stores the total participation count and the nullifier hash. The actual long-form feedback text is kept strictly off-chain (e.g., in Vercel Postgres) and is only accepted if the Midnight ZK transaction succeeds.

## Technical Architecture
- **Smart Contract**: Compact (using `Set<Bytes<32>>` for nullifiers).
- **Frontend**: Next.js + React.
- **Wallet**: Lace integration via `@midnight-ntwrk/wallet-sdk`.
- **Database**: Vercel Postgres (off-chain storage for long-form private data).

VEIL transforms the concept of a survey from "trust us, it's anonymous" to "it is mathematically impossible for us to know who wrote this."
