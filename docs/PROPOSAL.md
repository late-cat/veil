# 🌑 VEIL: Midnight Hackathon Product Proposal

**Project Name:** VEIL (Your Opinion, Your Privacy)  
**Target Network:** Midnight Preprod Testnet  
**Track/Category:** Consumer Focus — Anonymous Feedback & Surveys  

---

## 1. The Problem Statement
**What real problem are you solving?**
Organizations, DAOs, and enterprises desperately require honest, unfiltered feedback—whether through employee climate surveys, whistleblower reports, or decentralized governance polling. However, participants are often highly hesitant to provide genuine responses due to a fundamental lack of privacy. 

Traditional centralized survey tools (like Google Forms or SurveyMonkey) hold the master keys to the database. This means the platform—or the organization paying for it—can easily de-anonymize respondents by cross-referencing access logs, IP addresses, or email metadata. This inherent lack of trust creates a chilling effect on honesty. If users feel their identity might be exposed, they will either self-censor or refuse to participate entirely.

## 2. The VEIL Solution
**How is VEIL solving this exact issue?**
VEIL solves this by mathematically guaranteeing participant privacy through zero-knowledge cryptography. We completely separate the *Proof of Eligibility* from the *Survey Data*. 

When a user submits feedback on VEIL, they don't send their identity to the server. Instead, they generate a Zero-Knowledge Proof (ZKP) locally on their device. This proof cryptographically guarantees to the network that:
1. The user is on the approved eligibility list.
2. The user has not voted or submitted feedback previously (preventing Sybil attacks).

The network accepts the proof and records the feedback, but the user's wallet address and identity are never exposed to the public ledger. VEIL allows organizations to collect 100% verifiable feedback without ever knowing *who* submitted it.

## 3. Why Midnight?
**Why does this make sense on Midnight specifically?**
Midnight is uniquely equipped to handle this use case natively because of its "Selective Disclosure" capabilities. Attempting to build VEIL on traditional transparent ledgers (like Ethereum or Cardano) would require exposing the voter's identity to the mempool, or building incredibly complex off-chain ZK-SNARK infrastructure. 

Midnight's Compact language natively handles the division between the **private witness** (identity and feedback content) and the **public ledger** (campaign state and tallies). This makes true, scalable anonymous feedback achievable entirely on-chain without requiring users to trust a centralized sequencer, relayer, or traditional backend.

## 4. Target Users
**Who will use this?**
- **Web3 Communities & DAOs:** For conducting private governance sentiment checks and temperature checks where wallet privacy is paramount.
- **Enterprise Organizations:** For highly sensitive HR climate surveys or anonymous whistleblower reporting pipelines where retribution is a concern.
- **Event Organizers & Hackathons:** To collect unbiased, honest feedback from participants without pressuring them to attach their identities.

## 5. Technical Architecture
**Frontend + Contract + Data flow**
- **Smart Contract:** A Midnight Compact (`survey.compact`) smart contract utilizing a multi-tenant factory pattern to handle infinite concurrent surveys.
- **Data Flow:** 
  1. **Issuer** deploys a campaign on-chain with specific eligibility criteria.
  2. **Participant** connects their Midnight-compatible wallet (1A.M. or Lace) via the frontend.
  3. The **Compact Circuit** generates a zero-knowledge proof locally on the participant's machine, validating eligibility and checking against previous submissions via a nullifier.
  4. The **Proof** is broadcasted to the network. The contract verifies the proof, updates the public tally, and records the nullifier, leaving the feedback text and participant identity completely off-chain.
- **Frontend Client:** Next.js 14 App Router, featuring a highly responsive, aesthetically polished UI.
- **Integration:** Midnight.js DApp Connector API for seamless browser wallet signing, with state management synced dynamically via the Midnight Public Data Provider.

## 6. Complexity Evaluation
**What makes this technically challenging?**
The primary technical challenge lies in managing **Nullifiers** and **State Synchronization**. 
To prevent a user from voting twice without revealing who they are, the circuit must cryptographically hash the wallet state to generate a unique nullifier per campaign. If a user tries to double-vote, the contract rejects the transaction based on the nullifier collision, yet the ledger *never learns* which specific wallet attempted it. Handling this local ZK-proof generation seamlessly in the browser while maintaining a buttery-smooth UX requires tight integration with the Midnight JS SDK and a deep understanding of the DApp Connector API.

## 7. Roadmap
**MVP, User Acquisition, and Mainnet Vision**
- **Phase 1: MVP (Hackathon Deliverable):** Successfully deploy the `survey.compact` contract to the Preprod network. Deliver a fully responsive frontend where users can connect the 1A.M. wallet, generate local ZK proofs, and submit anonymous feedback to live campaigns.
- **Phase 2: User Acquisition & Features:** Introduce dynamic eligibility criteria (e.g., token-gated surveys) and deploy rich analytics dashboards for campaign issuers. Target Web3 communities and DAOs for initial beta testing.
- **Phase 3: Mainnet Vision:** Transition to the Midnight Mainnet. Evolve VEIL into a comprehensive, enterprise-grade suite for decentralized HR, whistleblower protection, and anonymous corporate governance, positioning it as the Web3 alternative to SurveyMonkey.
