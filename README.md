<div align="center">
  <img src="./frontend/src/img/veil-logo.jpg" alt="VEIL Logo" width="120" style="border-radius: 12px; margin-bottom: 20px;" />
  <h1>✦ VEIL Protocol ✦</h1>
  
  <p align="center">
    <strong>A Decentralized, ZK-Verified Survey Protocol built on the Midnight Blockchain.</strong>
  </p>
  
  [![CI/CD Status](https://github.com/late-cat/veil/actions/workflows/ci.yml/badge.svg)](https://github.com/late-cat/veil/actions)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Midnight Blockchain](https://img.shields.io/badge/Network-Midnight_Preprod-558763.svg)](https://midnight.network/)
  [![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

  *Your opinion. Your privacy. Launch campaigns and collect verified feedback without compromising participant identities.*

</div>

---

## ✧ SUBMISSION DETAILS & QUICK LINKS

*   **⎈ Network**: Midnight Preprod Testnet
*   **▤ GitHub Repository**: [https://github.com/late-cat/veil](https://github.com/late-cat/veil)
*   **⌁ Live Demo**: [https://veil-three-amber.vercel.app/](https://veil-three-amber.vercel.app/)
*   **▷ Demo Video**: [Watch on YouTube](https://youtu.be/CxdFbR8Xeio)
*   **⚙ Smart Contract**: [`survey.compact`](./backend/contracts/survey.compact)
*   **⌖ Contract Address**: [`0x7971fa81bb4af823994172ff4bc09fc0a45dfcc472b49a0b7c7b6d183e0b212f`](https://preprod.midnightexplorer.com/contracts/0x7971fa81bb4af823994172ff4bc09fc0a45dfcc472b49a0b7c7b6d183e0b212f) *(Note: Access via a private network/VPN or Cloudflare DNS if the explorer times out).*

---

## ✧ THE VISION: PROBLEM & SOLUTION

### ◈ The Problem: The Chilling Effect of Centralized Data Collection
Organizations desperately require honest feedback to make informed decisions. However, participants often fear providing genuine, critical responses due to a fundamental lack of privacy. Traditional Web2 tools (Google Forms, SurveyMonkey) hold the master keys to the database, allowing organizations to de-anonymize respondents via access logs, IP addresses, or metadata. This inherent lack of trust creates a **chilling effect on honesty**.

### ◈ The Solution: VEIL & Zero-Knowledge Cryptography
**VEIL** changes the paradigm of data collection by mathematically guaranteeing participant privacy. Built natively on the Midnight blockchain, VEIL leverages a **Selective Disclosure** architecture.

When a user submits feedback, their identity (Wallet ID) and the feedback content are completely shielded. Instead, VEIL computes a Zero-Knowledge Proof (ZKP) natively inside the client's browser using the `@midnight-ntwrk/midnight-js-protocol` SDK.

**Technical Implementation:**
1. **The Smart Contract:** The core ZK logic is implemented in [`backend/contracts/survey.compact`](./backend/contracts/survey.compact). The `submitFeedback` circuit accepts a public `campaignId` and a private `secretEligibilityHash`. 
2. **The Nullifier Generation:** In [`frontend/src/providers/MidnightProvider.tsx`](./frontend/src/providers/MidnightProvider.tsx), the application generates a cryptographically secure 32-byte `Uint8Array` seed via `crypto.getRandomValues(arr)`. This seed acts as a persistent private witness stored in the browser state, completely decoupled from the user's public Lace/1A.M. wallet address.
3. **The Proof:** The network verifies the ZK proof, allowing the `survey.compact` ledger to update the public tally and record the nullifier, thereby preventing double-voting without ever learning *who* actually voted.

---

## ✧ MIDNIGHT BUILDER CHALLENGE SUBMISSION CHECKLIST

### ☽ Level 1 Submission Requirements

| Requirement | Technical Status | Implementation & Evidence |
| :--- | :--- | :--- |
| **Toolchain Installed & Compiles** | ✓ **Verified** | Installed `@midnight-ntwrk/compact-compiler`. The `survey.compact` circuit successfully compiles via the `npm run compile` command inside the backend. |
| **Passing Test Suite** | ✓ **Verified** | 3 native AST execution tests passing in [`backend/tests/survey.test.ts`](./backend/tests/survey.test.ts). |
| **Managed Directory Present** | ✓ **Verified** | Output generated at [`backend/contracts/managed/survey/`](./backend/contracts/managed/survey/) containing BZKIR bytecodes and prover/verifier keys. |
| **Contract Deployed to Preprod** | ✓ **Verified** | Deployed to Preprod. Verified Address: `0x7971fa81bb4af823994172ff4bc09fc0a45dfcc472b49a0b7c7b6d183e0b212f`. |
| **Product Idea (README)** | ✓ **Verified** | Initial product idea fully drafted in the "Vision: Problem & Solution" section above. |
| **Minimum 5 Meaningful Commits** | ✓ **Verified** | Over 150 semantic commits exist, demonstrating iterative development. |
| **Public GitHub Repository** | ✓ **Verified** | The repository is completely public with a comprehensive `README.md`. |
| **Setup Instructions (Local)** | ✓ **Verified** | Complete and accurate Docker and Node.js setup instructions are provided at the bottom of this document. |
| **Screenshot: Compile Output** | ✓ **Verified** | Provided in the "Checkpoint Deliverables" section below. |
| **Screenshot: Contract Deployed** | ✓ **Verified** | Provided in the "Checkpoint Deliverables" section below. |
| **Privacy Explanation (State vs Witness)**| ✓ **Verified** | Exhaustive breakdown provided in the "Privacy Model" section below. |

### ◐ Level 2 Submission Requirements

| Requirement | Technical Status | Implementation & Evidence |
| :--- | :--- | :--- |
| **Lace Connect/Disconnect Implemented**| ✓ **Verified** | Robust connection/disconnection logic utilizing `window.midnight.mnLace` implemented in [`MidnightProvider.tsx`](./frontend/src/providers/MidnightProvider.tsx). |
| **Circuit Called from Frontend**| ✓ **Verified** | The `submitFeedback` circuit is successfully invoked via `providers.midnightProvider.submitTx()` directly from the browser. |
| **Observable Privacy Behavior** | ✓ **Verified** | Double-vote prevention via **ZK Nullifiers**. Double votes are mathematically rejected on-chain without revealing the identity of the voter. |
| **Preprod Deployment (Verifiable)**| ✓ **Verified** | Contract is verified on the Midnight Explorer at `0x7971fa...`. |
| **Minimum 8 Meaningful Commits** | ✓ **Verified** | Commits far exceed the requirement. |
| **Live Demo Link** | ✓ **Verified** | Fully deployed and Edge-compatible: [https://veil-three-amber.vercel.app/](https://veil-three-amber.vercel.app/). |
| **Demo Video (Connect + Circuit Call)**| ✓ **Verified** | High-quality walkthrough video provided in the Quick Links section. |
| **Document Privacy Claim** | ✓ **Verified** | The exact privacy guarantees of the Selective Disclosure architecture are documented. |

### ❂ Level 3 Submission Requirements

| Requirement | Technical Status | Implementation & Evidence |
| :--- | :--- | :--- |
| **Functional dApp Integration** | ✓ **Verified** | Fully integrated the Midnight JS SDK. Allows users to launch campaigns and collect shielded feedback natively on Preprod. |
| **Minimum 3 Tests Passing** | ✓ **Verified** | 3/3 native AST execution tests passing. Validates both successful state transitions and negative cryptographic boundaries. |
| **CI/CD Pipeline Running** | ✓ **Verified** | Configured `.github/workflows/ci.yml` running `npm run compile` and `npm test` automatically. |
| **Approved Idea Submitted** | ✓ **Verified** | The project strictly aligns with the "Anonymous Feedback/Surveys" hackathon category. |
| **Minimum 10 Meaningful Commits**| ✓ **Verified** | Repository history perfectly aligns with the requirement. |
| **Screenshot: Test Output** | ✓ **Verified** | Provided in the "Passing Suite" deliverables section below. |
| **CI/CD Badge & Passing Runs** | ✓ **Verified** | Dynamic CI/CD Badge is active at the very top of this README. |
| **Demo Video (Full Functionality)**| ✓ **Verified** | Walkthrough covers end-to-end functionality from campaign creation to proof synthesis. |
| **Privacy Model "Observer"** | ✓ **Verified** | Detailed in the Privacy Model section, explicitly stating what a passive observer can and cannot learn. |

### ◑ Level 4 Submission Requirements

| Requirement | Technical Status | Implementation & Evidence |
| :--- | :--- | :--- |
| **Working MVP on Preprod** | ✓ **Verified** | Fully functional dApp deployed to Vercel. Contract `0x7971fa...` live on Midnight Preprod with verifiable on-chain state. |
| **Documentation (README + Setup + Usage)** | ✓ **Verified** | Comprehensive README with setup instructions. User-facing usage guide at [`docs/USAGE.md`](./docs/USAGE.md). |
| **CI/CD Pipeline Running** | ✓ **Verified** | `.github/workflows/ci.yml` with genuine Compact Compiler download, circuit compilation, and test execution. CI badge active. |
| **Product X Profile Created** | ⏳ **Pending** | X profile link will be added here after account creation. |
| **Minimum 15 Meaningful Commits** | ✓ **Verified** | 160+ semantic commits demonstrating iterative, genuine development. |
| **Live Preprod Demo Link** | ✓ **Verified** | [https://veil-three-amber.vercel.app/](https://veil-three-amber.vercel.app/) |
| **Demo Video of MVP** | ✓ **Verified** | [Watch on YouTube](https://youtu.be/CxdFbR8Xeio) |
| **Product Proposal** | ✓ **Verified** | Complete proposal at [`docs/PROPOSAL.md`](./docs/PROPOSAL.md) covering target users, Midnight justification, data model, and mainnet feasibility. |

---

## ✧ CHECKPOINT DELIVERABLES: DEPLOYMENT PROOFS

### 1. Compile Output & ZK Circuit Generation
The smart contract was compiled using `@midnight-ntwrk/compact-compiler v0.31.1`.
**Command executed:** `npx compactc survey.compact -o managed/survey`
**Result:** Successfully generated the BZKIR bytecodes, prover keys (`.pk`), and verifier keys (`.vk`) for the `submitFeedback` circuit. These files reside in the `backend/contracts/managed` directory and are natively bundled into the frontend via the `sync-zk.mjs` script during build.
<details open>
<summary><b>View Compile Output</b></summary>
<br>

![Compile Output](./frontend/src/img/compile-ss.png)
</details>

### 2. Verified ZK-Proof Submission on Preprod
**Transaction Hash:** [`0x6d366cb59ccaa9eafa963d6335a42ce40323417b4bf3db78e0c09a8288b523e8`](https://preprod.midnightexplorer.com/transactions/0x6d366cb59ccaa9eafa963d6335a42ce40323417b4bf3db78e0c09a8288b523e8)

*What happened on-chain?* 
The transaction successfully invoked the `submitFeedback` circuit. The Midnight network verified the Zero-Knowledge proof generated locally on the client. It securely updated the `campaigns` tally increment and permanently added the user's secret hash to the `nullifiers` set, thereby preventing replay attacks or double-voting without exposing the wallet's identity.
<details open>
<summary><b>View Successful Transaction</b></summary>
<br>

![Successful Transaction](./frontend/src/img/sucessfull-txn.png)
</details>

---

## ✧ LACE WALLET INTEGRATION & HTTP PROOF SERVER WORKAROUND

### The Challenge
During development, we discovered a significant integration disparity: The **1A.M. Wallet** natively supports an in-browser proving provider (`api.getProvingProvider(zkConfig)`), which computes ZK-SNARKs directly inside the browser extension. However, the **Lace Wallet** currently lacks this capability and throws a `TypeError` if invoked natively for client-side proving.

### The Technical Solution
To ensure flawless compatibility with the Lace Wallet, we implemented a dynamic fallback architecture in [`MidnightProvider.tsx`](./frontend/src/providers/MidnightProvider.tsx):
1. **Wallet Detection:** The application sniffs the DApp connector identity (`walletId === 'lace'`).
2. **Proof Server Fallback:** If Lace is detected, we bypass the native API and instantiate the `@midnight-ntwrk/midnight-js-testing` package's `httpClientProofProvider`.
3. **Remote Proving Engine:** We deployed the official Midnight Proof Server (`midnightntwrk/proof-server:8.1.0`) on a remote Render instance. The frontend seamlessly serializes the unproven transaction, sends an HTTP POST request to the remote server to synthesize the ZK-SNARK, and successfully submits the returned proof.

---

## ✧ PASSING SUITE — LEVEL 3

The project utilizes the `@midnight-ntwrk/compact-runtime` to natively execute the contract Abstract Syntax Tree (AST) within the Node.js test environment.

**File:** [`backend/tests/survey.test.ts`](./backend/tests/survey.test.ts)

**Validated Invariants:**
1. **Successful State Transition:** Verifies that `contract.circuits.submitFeedback` successfully executes against a mock ledger state and generates valid `proofData` when supplied with valid parameters.
2. **Strict Cryptographic Boundaries (Negative Test):** Submits an invalid 31-byte Campaign ID array, verifying that `assert.throws` accurately catches the `expected value of type Bytes<32>` error, proving the circuit's type safety.
3. **Private State Initialization:** Validates that `createConstructorContext` correctly initializes the private ledger schema without data leaks.

<details open>
<summary><b>View Test Output</b></summary>
<br>

![Test Output](./frontend/src/img/test-output.png)
</details>

---

## ✧ UNIFIED CI/CD PIPELINE

**File:** [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

Our continuous integration pipeline automatically validates every push to the repository to ensure cryptographic stability:
- **Build Step:** Installs all Next.js and Midnight SDK dependencies.
- **Circuit Compilation:** Downloads and executes `compact-installer.sh`, executing the Compact Compiler natively on the Ubuntu runner to ensure `survey.compact` successfully compiles into ZK parameters.
- **AST Execution:** Executes `npm test`, running the `node:test` suite against the freshly compiled bytecodes to guarantee no regressions in the contract logic.

<details open>
<summary><b>View CI/CD Pipeline</b></summary>
<br>

![CI/CD Pipeline](./frontend/src/img/CI_cd-pipeline.png)
</details>

---

## ✧ SEAMLESS MOBILE UX

VEIL Protocol is fully optimized for mobile devices. We implemented native responsive layouts, including touch-optimized hamburger menus for the main navigation and the dashboard sidebar, ensuring the entire dApp works perfectly on smartphones.

<details open>
<summary><b>View Mobile Layouts</b></summary>
<br>

<div align="center">
  <img src="./frontend/src/img/mobile-responsive.png" alt="Mobile Dashboard Menu" width="45%" style="border-radius: 12px; margin-right: 10px;" />
  <img src="./frontend/src/img/mobile-2.png" alt="Mobile Navigation" width="45%" style="border-radius: 12px;" />
</div>
</details>

---

## ✧ PRIVACY MODEL: WHAT AN OBSERVER CAN AND CANNOT LEARN

VEIL strictly adheres to Midnight's Selective Disclosure architecture.

### ◉ PUBLIC STATE (What an Observer CAN Learn)
- **Campaign Exists:** An observer can read the `campaigns` mapping on the ledger to see the 32-byte Campaign ID and the public tally of total participants.
- **Nullifier Set:** An observer can see a list of random 32-byte hashes added to the `nullifiers` set, indicating that *someone* has voted.

### ◉ PRIVATE WITNESS (What an Observer CANNOT Learn)
- **Participant Identity:** The identity is protected by a dynamically generated, cryptographically secure 32-byte random seed (`crypto.getRandomValues()`) stored strictly in the user's browser `localStorage`. This seed acts as a persistent private witness to generate the ZK nullifier. The Wallet Address is NEVER exposed on-chain.
- **The Feedback Content:** The platform implements a **Hybrid Asymmetric Encryption** architecture. In [`frontend/src/app/c/[id]/page.tsx`](./frontend/src/app/c/[id]/page.tsx), a random AES-256-GCM key encrypts the actual feedback payload. That AES key is then cryptographically wrapped using the Campaign Issuer's RSA-OAEP Public Key. The encrypted ciphertext is stored off-chain in our database, making it mathematically unreadable to everyone—including VEIL servers—except the specific Issuer holding the private key.
- **Double-Voting Attempts:** Observers only see that an anonymous transaction was mathematically rejected by the smart contract due to a zero-knowledge nullifier collision. They cannot determine *who* attempted the double-vote.

---

## ✧ HIGH-LEVEL SYSTEM ARCHITECTURE

```mermaid
sequenceDiagram
    participant I as Issuer
    participant DB as Vercel Blob Storage
    participant N as Midnight Preprod
    participant P as Participant Browser
    participant PS as Proof Server (Lace Only)
    
    I->>DB: Create Campaign (Uploads RSA PubKey)
    I->>N: Deploy/Register on Ledger
    P->>DB: Fetch Campaign & PubKey
    P->>P: Encrypt Feedback (AES) & Wrap Key (RSA)
    P->>P: Generate 32-byte Secret Witness
    
    alt Using 1A.M. Wallet
        P->>P: Compute ZK-SNARK locally in Extension
    else Using Lace Wallet
        P->>PS: Remote API request to synthesize ZK-SNARK
        PS-->>P: Return valid Proof Data
    end
    
    P->>N: Broadcast ZK Proof & Nullifier
    N->>N: Verify Proof, Reject if Nullifier exists
    P->>DB: Save Encrypted Feedback Ciphertext
```

---

## ✧ TECHNOLOGY STACK
*   **Smart Contracts**: Midnight Compact Compiler (`v0.31.1`)
*   **Client Architecture**: Next.js 14 (App Router), TypeScript, Tailwind CSS
*   **Wallet Integration**: `@midnight-ntwrk/midnight-js-protocol`, DApp Connector (`window.midnight.mnLace` & `mn1am`)
*   **Database Persistence**: `@vercel/blob` Object Storage (via `api/db.ts`)
*   **Testing**: Node.js Native Test Runner (`node:test`) & `@midnight-ntwrk/compact-runtime`

---

## ✧ PROJECT STRUCTURE

```text
veil-platform/
├── backend/
│   ├── contracts/         # Midnight Compact smart contract source code
│   │   ├── managed/       # Generated ZK circuits, proving keys, and verification keys
│   │   └── survey.compact # Core selective disclosure logic
│   ├── src/               # Deployment and wallet syncing scripts
│   └── tests/             # Automated test suite validating ZK constraints (survey.test.ts)
├── frontend/
│   ├── src/app/           # Next.js App Router (Issuer Dashboard, Participant View)
│   ├── src/providers/     # Midnight Wallet SDK integration context
│   └── package.json       # Frontend dependencies and Next.js config
├── docs/
│   ├── PROPOSAL.md        # Product proposal (target users, Midnight justification, data model)
│   ├── USAGE.md           # User-facing guide (how to create surveys and submit feedback)
│   └── X_LAUNCH_TWEETS.md # Product X profile launch content
├── PROPOSAL.md            # Root-level proposal reference
└── .github/workflows/     # GitHub Actions CI/CD pipelines (ci.yml)
```

---

## ✧ SETUP & RUN LOCALLY

### Prerequisites
1. **Node.js**: Ensure you have Node.js v22 installed.
2. **Docker**: Ensure Docker Desktop is running (required for the Lace Proof Server).
3. **Midnight Toolchain**: Ensure the `compact-compiler` is installed on your machine.
4. **Wallet**: Install the **1A.M. Wallet** or **Lace** browser extension.

### 1. Boot the Local Proof Server (Required for Lace)
Navigate to the `backend` directory and spin up the Docker Proof Server infrastructure.
```bash
cd backend
docker compose up -d proof-server
```
*Note: This spins up `midnightntwrk/proof-server:8.1.0` on port 6300, matching the version required by the Midnight SDK. It avoids DNS/CORS issues natively without a Vercel proxy.*

### 2. Compile the Smart Contract
Build the ZK circuits and generate the prover/verifier keys in the `managed/` directory.
```bash
npm install
npm run compile
```

### 3. Run the ZK Test Suite
Validate the contract AST execution logic locally.
```bash
npm test
```

### 4. Launch the Next.js Frontend
Navigate to the `frontend` directory. The `npm run dev` script will automatically execute `sync-zk.mjs` to copy the compiled ZK parameters into the Next.js public directory before booting the server.
```bash
cd ../frontend
npm install
npm run dev
```
Visit `http://localhost:3000` in your browser.

---

## ✧ USAGE GUIDE

For a complete, step-by-step guide on how to use VEIL Protocol — including creating surveys, submitting anonymous feedback, and understanding the privacy guarantees — see:

**📖 [`docs/USAGE.md`](./docs/USAGE.md)**

---

## ✧ PRODUCT PROPOSAL

VEIL's detailed product proposal — covering target users, Midnight justification, data model, and mainnet feasibility — is available at:

**📋 [`docs/PROPOSAL.md`](./docs/PROPOSAL.md)**

---

## ✧ PRODUCT X PROFILE

*Link will be added after the X account is created.*

<!-- REPLACE THIS LINE WITH: **🐦 [Follow VEIL on X](https://x.com/YOUR_HANDLE)** -->

---

<div align="center">
  <sub>Built with ♡ for the Midnight Ecosystem</sub>
</div>
