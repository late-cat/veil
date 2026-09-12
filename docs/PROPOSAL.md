# 🌑 VEIL: Midnight Hackathon Product Proposal

**Project Name:** VEIL (Your Opinion, Your Privacy)  
**Target Network:** Midnight Preprod Testnet  
**Hackathon Category:** Anonymous Feedback / Survey (Enable verifiable participation while keeping responses private)  

---

## 1. The Problem Statement
Organizations, DAOs, and enterprises desperately require honest, unfiltered feedback—whether through employee climate surveys, whistleblower reports, or decentralized governance polling. However, participants are highly hesitant to provide genuine responses due to a fundamental lack of privacy. 

Traditional centralized survey tools (like Google Forms or SurveyMonkey) hold the master keys to the database. This means the platform—or the organization paying for it—can easily de-anonymize respondents by cross-referencing access logs, IP addresses, or email metadata. This inherent lack of trust creates a chilling effect on honesty. If users feel their identity might be exposed, they will either self-censor or refuse to participate entirely.

## 2. The Solution: VEIL
VEIL solves this by mathematically guaranteeing participant privacy using zero-knowledge cryptography. We completely separate the *Proof of Eligibility* from the *Survey Data*. 

When a user submits feedback on VEIL, they don't send their identity to the server. Instead, they generate a Zero-Knowledge Proof (ZKP) locally on their device. This proof cryptographically guarantees to the network that:
1. The user is on the approved eligibility list.
2. The user has not voted or submitted feedback previously (preventing Sybil attacks via a unique Nullifier).

The network accepts the proof and records the feedback, but the user's wallet address and identity are never exposed. VEIL allows organizations to collect 100% verifiable feedback without ever knowing *who* submitted it.

## 3. The Midnight Privacy Model (Selective Disclosure)
VEIL is built explicitly around Midnight's native data protection and selective disclosure architecture. Attempting this on traditional ledgers (like Ethereum) would require exposing identities to the mempool or building highly complex off-chain ZK-infrastructure. VEIL leverages the `survey.compact` language to natively handle the division of data:

- **What is PUBLIC (On-Chain Ledger State):** The existence of the campaign, the eligibility criteria (Merkle root), the total number of participants (tally), and the anonymized feedback payload.
- **What is PRIVATE (Private Witness):** The participant's wallet address and the direct link between the user and their specific feedback submission.
- **What the user PROVES without revealing:** The user proves they possess a valid key/eligibility token and have not previously generated a nullifier for this specific campaign, all without ever revealing which specific key they hold.

## 4. Target Users
- **Web3 Communities & DAOs:** For conducting private governance sentiment checks and temperature checks where wallet privacy is paramount.
- **Enterprise Organizations:** For highly sensitive HR climate surveys or anonymous whistleblower reporting pipelines where retribution is a concern.
- **Event Organizers:** To collect unbiased, honest feedback from hackathon or conference participants without pressuring them to attach their identities.

## 5. Technical Architecture
- **Smart Contract (`survey.compact`):** Utilizes a multi-tenant factory pattern to handle infinite concurrent surveys securely on the Midnight Preprod network.
- **Frontend Client:** Next.js 14 App Router, featuring a highly responsive, aesthetically polished UI.
- **Wallet Integration:** Midnight.js DApp Connector API for seamless local proof generation using the Lace / 1A.M. browser wallet.
- **State Synchronization:** Local ephemeral state synced dynamically via the Midnight Public Data Provider to ensure real-time tally updates.

## 6. Current Status & Roadmap
- **Phase 1: MVP (Completed for Hackathon):** We have successfully deployed the `survey.compact` contract to the Preprod network and built a fully functional, mobile-responsive frontend. Users can connect their 1A.M. wallet, generate local ZK proofs, and submit completely anonymous feedback to live campaigns.
- **Phase 2: User Acquisition & Analytics (Next 3 Months):** Introduce dynamic eligibility criteria (token-gated surveys) and deploy rich analytics dashboards for campaign issuers. We will begin beta testing by partnering directly with Web3 communities.
- **Phase 3: Mainnet Vision (Q3 2027):** Transition to the Midnight Mainnet. Evolve VEIL into a comprehensive, enterprise-grade suite for decentralized HR, whistleblower protection, and anonymous corporate governance, positioning it as the Web3 alternative to SurveyMonkey.
