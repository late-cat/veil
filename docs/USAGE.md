# ✦ How to Use VEIL Protocol ✦

> **Your opinion. Your privacy.**
> VEIL lets organizations collect verified feedback while mathematically guaranteeing participant anonymity using Zero-Knowledge Proofs on the Midnight Blockchain.

---

## ✧ What You Need

### For Campaign Issuers (Creating Surveys)
- A modern web browser (Chrome, Brave, or Firefox recommended)
- A Midnight-compatible wallet extension installed:
  - **1A.M. Wallet** *(Recommended)* — supports native in-browser proof generation
  - **Lace Wallet** — supported via remote proof server fallback
- Your wallet configured to the **Midnight Preprod Testnet**
- Testnet tDUST tokens for transaction fees (available from the Midnight faucet)

### For Participants (Submitting Feedback)
- A modern web browser
- A Midnight-compatible wallet (1A.M. or Lace)
- The survey link shared by the campaign issuer

---

## ✧ For Campaign Issuers — Creating a Survey

### Step 1: Connect Your Wallet
1. Visit [https://veil-three-amber.vercel.app/](https://veil-three-amber.vercel.app/)
2. Click **"Connect Wallet"** in the top navigation bar.
3. Select your wallet (1A.M. or Lace) from the modal.
4. Approve the connection in your wallet extension.
5. You will see a confirmation animation once your wallet is securely connected.

### Step 2: Navigate to the Dashboard
1. Click **"Dashboard"** in the navigation bar.
2. The Dashboard displays all existing campaigns with real-time participation data.

### Step 3: Create a New Campaign
1. In the Dashboard, switch to the **"Create"** tab.
2. Fill in the **Campaign Title** and **Description**.
3. Add survey questions using the question builder:
   - **Text** — open-ended text responses
   - **Rating** — star-based rating scales
   - **Multiple Choice** — predefined answer options
4. Optionally upload a **banner image** and set an **end date**.
5. Click **"Create Survey"**.

> **What happens behind the scenes:**
> VEIL generates a unique RSA key pair for your campaign. The public key is stored with the campaign metadata. The private key is stored locally in your browser — only you can decrypt the feedback responses.

### Step 4: Share the Survey Link
1. After creation, your campaign appears in the "Active" tab.
2. Click on the campaign to view its detail page.
3. Copy and share the unique survey link (e.g., `https://veil-three-amber.vercel.app/c/XXXXXXXX`).
4. Anyone with this link and a Midnight wallet can participate anonymously.

### Step 5: View Responses
1. Navigate to your campaign's detail page from the Dashboard.
2. View the participation count and encrypted response data.
3. Responses are decrypted using the RSA private key stored in your browser.

---

## ✧ For Participants — Submitting Anonymous Feedback

### Step 1: Open the Survey Link
1. Click the survey link shared by the campaign issuer.
2. You will see the campaign title, description, and survey questions.

### Step 2: Connect Your Wallet
1. Click **"Connect Wallet"** to authenticate.
2. Select your wallet (1A.M. or Lace).
3. Approve the connection in your wallet extension.

### Step 3: Fill Out the Survey
1. Answer all the survey questions displayed on the page.
2. Your responses are processed entirely in your local browser — they are never sent to any server in plaintext.

### Step 4: Submit with Zero-Knowledge Proof
1. Click **"Submit Feedback"**.
2. VEIL performs the following steps automatically:
   - **Encrypting Response** — Your feedback is encrypted with AES-256-GCM, and the AES key is wrapped with the campaign's RSA public key.
   - **Generating ZK-SNARK** — A Zero-Knowledge proof is computed locally (1A.M.) or via the proof server (Lace), proving your eligibility without revealing your identity.
   - **Broadcasting to Midnight** — The proof and a cryptographic nullifier are submitted to the Midnight Preprod network.
3. Your wallet will prompt you to sign the transaction — approve it.
4. Once confirmed, you will see a success screen with a transaction hash linking to the Midnight Explorer.

> **Important:** Keep your wallet extension open and unlocked during the proof generation process. This can take 30–90 seconds depending on network conditions.

---

## ✧ What Gets Proved (and What Stays Private)

| What VEIL Proves | What Stays Private |
|---|---|
| You are eligible to participate | Your wallet address / identity |
| You have not already submitted | Which response belongs to you |
| Your submission is cryptographically valid | The content of your feedback |
| The campaign participation count increased | Any link between you and your answers |

**In plain English:** VEIL proves *that* you participated without proving *who* you are.

The nullifier mechanism ensures you cannot vote twice, but an observer looking at the blockchain can only see that "someone" voted — they cannot determine which wallet or person it was.

---

## ✧ Troubleshooting

### "Wallet Connection Timeout"
- Ensure your wallet extension is **unlocked** and set to the **Midnight Preprod** network.
- Try disconnecting and reconnecting.
- If using Lace, wait for the "Proof Server Ready" indicator to appear before connecting.

### "Proof Server Waking..."
- When using the Lace Wallet, the remote proof server may need 15–30 seconds to wake up from cold start.
- The indicator below the Lace option shows the current status. Wait until it shows **"Proof Server Ready"** (green dot).

### "You have already submitted feedback"
- This is expected behavior. The ZK nullifier system prevents double-voting per campaign.
- The nullifier is tied to your browser's cryptographic seed, not your wallet address. If you submitted from a different browser/device, you can still participate.

### Transaction Takes Too Long
- ZK proof generation is computationally intensive. Allow 30–90 seconds for the process to complete.
- Do not close the browser tab or lock your wallet during proof generation.

### Survey Not Found After Creating
- If you see "Survey not found" immediately after creation, click **"Force Refresh"**. This is a rare network propagation delay.

---

<div align="center">
  <sub>VEIL Protocol — Your opinion. Your privacy. Verifiable by design.</sub>
</div>
