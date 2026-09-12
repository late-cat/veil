# ✦ VEIL — Your Opinion, Your Privacy ✦

**◈ Target Network:** Midnight Preprod Testnet  
**◈ Hackathon Category:** Consumer Focus (Anonymous Feedback & Surveys)

---

## ✧ THE PROBLEM
Organizations, DAOs, and enterprises need honest feedback — from employee surveys and whistleblower reports to decentralized governance polling. However, people often hesitate to speak honestly when their identity can potentially be linked to their responses.

Traditional survey platforms such as Google Forms and SurveyMonkey rely on centralized infrastructure where the platform or organization ultimately controls the data. Even when a survey is labeled anonymous, metadata such as accounts, access logs, IP addresses, or email information can potentially compromise that anonymity.

**➜ This creates a chilling effect:** when people do not fully trust the system, they self-censor.

---

## ✧ THE SOLUTION
VEIL is a privacy-preserving survey platform built on the Midnight Blockchain.

Instead of sending their identity to the server, participants generate a Zero-Knowledge Proof locally on their device. 
The proof allows the network to verify:
**①** The participant is eligible for the campaign.  
**②** The participant has not already submitted a response.  
**③** The submission is valid without revealing the participant's identity.

**◈ A unique nullifier** prevents duplicate participation while keeping the participant unlinkable to their response.

**➜ In simple terms:** VEIL lets users prove that they are allowed to participate without proving who they are.

---

## ✧ MIDNIGHT PRIVACY MODEL
VEIL is designed around Midnight's native privacy and selective-disclosure architecture.

**◉ PUBLIC ON-CHAIN INFORMATION**  
• Campaign configuration  
• Eligibility commitment  
• Participation count  
• Verifiable survey results  

**◉ PRIVATE INFORMATION**  
• Participant credentials  
• Private eligibility information  
• The relationship between a participant and their submission  

**◇** The participant can prove that they possess valid eligibility credentials and have not previously participated, without revealing which credential belongs to them.

**➜ This makes privacy a property of the protocol** rather than simply a promise made by a centralized platform.

---

## ✧ TARGET USERS
**◎ Web3 Communities & DAOs**  
Private governance sentiment checks and community polling without exposing individual wallets.

**◎ Enterprises**  
Anonymous HR climate surveys, internal feedback, and sensitive reporting where participants may fear retaliation.

**◎ Events & Hackathons**  
Unbiased feedback from participants without forcing them to attach their identity to their responses.

---

## ✧ TECHNICAL ARCHITECTURE
**⚙ Smart Contract**  
`survey.compact`, designed to support multiple independent survey campaigns on Midnight Preprod.

**⌁ Frontend**  
Next.js App Router with a responsive and polished user interface.

**◇ Wallet Integration**  
Midnight.js DApp Connector API with supported Midnight wallets (Lace/1A.M.) for local proof generation and transaction signing.

**↻ State Synchronization**  
Midnight Public Data Provider for synchronizing public campaign state and verifiable participation data.

---

## ✧ CURRENT STATUS

**✓ PHASE 1 — HACKATHON MVP (Completed)**  
The `survey.compact` contract has been deployed to Midnight Preprod, with a functional survey creation and participation flow, wallet integration, local ZK proof generation, anonymous feedback submission, responsive frontend, and live campaign state.

**→ PHASE 2 — NEXT 3 MONTHS**  
Token-gated and dynamic eligibility, advanced analytics for campaign issuers, beta testing with Web3 communities, and additional privacy-preserving campaign types.

**→ PHASE 3 — MAINNET VISION (Q3 2027)**  
Move VEIL toward Midnight Mainnet and evolve it into an enterprise-grade privacy platform for anonymous employee feedback, whistleblower protection, corporate governance, DAO governance, and sensitive research or community polling.

---

### ✦ LONG-TERM VISION ✦
VEIL turns anonymous feedback from a promise into something that can be cryptographically verified.

**◈ Your opinion.**  
**◈ Your privacy.**  
**◈ Verifiable by design.**
