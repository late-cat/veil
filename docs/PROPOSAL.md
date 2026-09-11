# Midnight Hackathon Idea Proposal: VEIL Platform

**Idea Category:** Anonymous Feedback/Surveys
**Project Name:** VEIL Platform (Your Opinion, Your Privacy)
**Target Network:** Midnight Preprod Testnet

## The Problem
Organizations desperately need honest feedback (surveys, whistleblower reports, performance reviews), but employees and users are hesitant to provide it due to privacy concerns. Centralized survey tools (like Google Forms or SurveyMonkey) hold the key to the database, meaning they—or the organization paying them—can easily deanonymize respondents by looking at access logs, IPs, or email metadata. This creates a chilling effect on honesty.

## The Solution (VEIL)
VEIL is a decentralized, ZK-verified survey platform built on the Midnight blockchain. It completely separates the **Proof of Eligibility** from the **Survey Data**.

Using Midnight’s "Selective Disclosure" architecture:
1. **The Issuer** creates a campaign on-chain and specifies an eligibility list (or keeps it open).
2. **The Participant** receives a link, connects their 1AM Wallet, and writes their feedback.
3. **The Magic:** The Midnight Compact circuit generates a zero-knowledge proof locally on the participant's machine. This proof cryptographically guarantees that the participant is eligible to vote, and that they haven't voted before (using a nullifier). 
4. **The Submission:** The proof is submitted to the Midnight network. The network verifies the proof and tallies the vote, but the raw text of the feedback and the user's wallet address are completely omitted from the public ledger state.

## Why Midnight?
Midnight is uniquely suited for this because of its native Data Protection capabilities. Attempting this on Ethereum would require exposing the identity to the mempool or building complex, off-chain ZK-SNARK infrastructure. Midnight's `survey.compact` language natively handles the private witness and public ledger division, making true anonymous feedback both possible and scalable.

## Planned Architecture
- **Smart Contract:** `survey.compact` deploying a multi-tenant factory pattern.
- **Frontend:** Next.js App Router for the Issuer Dashboard and Participant Submission view.
- **Wallet Integration:** Midnight.js DApp Connector API for Lace/1AM Wallet.
- **State Management:** Local ephemeral state synced with the Midnight Public Data Provider.
