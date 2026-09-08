<div align="center">
  <img src="https://raw.githubusercontent.com/bapi/new-moon-stellar/main/assets/veil-logo.png" alt="VEIL Logo" width="120" />
  <h1>🌑 VEIL Platform</h1>
  <p><strong>Your opinion. Your privacy.</strong></p>
  <p>A Decentralized, ZK-Verified Survey Platform built on the Midnight Blockchain.</p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Midnight Blockchain](https://img.shields.io/badge/Midnight-Testnet-558763.svg)](https://midnight.network/)
  [![Next.js](https://img.shields.io/badge/Next.js-16.3-black)](https://nextjs.org/)
  [![CI Pipeline](https://github.com/bapi/new-moon-stellar/actions/workflows/ci.yml/badge.svg)](https://github.com/bapi/new-moon-stellar/actions/workflows/ci.yml)
</div>

<br />

## 📖 Overview

VEIL Platform is a privacy-preserving Web3 alternative to Google Forms or SurveyMonkey. 

Traditional surveys force users to trust the organization not to look at backend logs. **VEIL** changes the paradigm by separating the **Proof** from the **Data**. It allows anyone to act as an "Issuer" to launch a campaign, distribute a shareable link, and collect verified, anonymous feedback.

This project fulfills **Level 3** of the **Midnight Builder Challenge**.

---

## 🔒 Privacy Model (Selective Disclosure)

VEIL utilizes a "Selective Disclosure" architecture within its `survey.compact` smart contract to balance organizational trust with individual privacy.

- **What is Public?** The public ledger contains `campaigns: Map<Bytes<32>, Uint<32>>` tracking the participation tally for each specific campaign, and a `nullifiers: Set<Bytes<32>>` to prevent double-submissions.
- **What is Private?** The participant's identity (wallet address) and the raw feedback text remain off-chain, completely decoupled.
- **What is Proven?** That the participant is eligible, they have not submitted before for this specific campaign, and their feedback is securely cryptographically linked to the nullifier.

---

## 🏗️ Architecture & Features

### 1. Issuer Dashboard (`/dashboard`)
Issuers can instantly create multiple campaigns. The platform automatically generates a unique Campaign ID, a shareable URL, and participant QR codes without requiring the issuer to write any code.

### 2. ZK-Shielded Participant View (`/c/[id]`)
Participants use the generated link to connect their Lace wallet. The Midnight Compact circuit verifies their eligibility (via a private witness) and generates a Zero-Knowledge proof of submission.

### 3. Decrypted Results (`/dashboard/[id]`)
Issuers can view the total on-chain participation count mapped against the decrypted off-chain feedback, verifying each entry's `Proof ID`.

---

## 🚀 Quick Start (Local Development)

To run VEIL locally, you will need **Node.js (v22)**, **Docker Desktop**, and the **Midnight Compact Compiler** installed.

### 1. Compile the Smart Contract
The multi-tenant Compact circuit must be compiled to generate the managed assets.
```bash
cd mn-demo
npm install
npm run compile
```

### 2. Launch the Platform
Start the Next.js frontend application.
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. **Ensure you have the Lace Wallet for Midnight Testnet installed in your browser.**

---

## 🧪 Testing & CI/CD

VEIL ships with a comprehensive testing suite and CI/CD pipeline, meeting the Level 3 requirements.

### Smart Contract Tests
The multi-tenant Compact circuit is rigorously tested (`mn-demo/tests/survey.test.ts`).
```bash
cd mn-demo
npm test
```

### CI/CD Pipeline
Every push to the repository triggers `.github/workflows/ci.yml`. This pipeline automatically:
1. Compiles the `survey.compact` circuit.
2. Executes the multi-tenant test suite via `node --import tsx --test`.

---

## 📜 Links & Documentation

- [Midnight Network Documentation](https://docs.midnight.network/)
- [Hackathon Grading Criteria](./levels.md)

<div align="center">
  <sub>Built with ❤️ for the Midnight Ecosystem</sub>
</div>
