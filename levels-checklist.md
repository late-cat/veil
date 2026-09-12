# Midnight Learning Path — Submission Requirements

## Level 1 — New Moon Submission

### What You Will Learn

- Installing the Midnight toolchain, including the Compact compiler, proof server, Node.js 22, and Docker.
- Writing a Compact contract with public ledger state and a private witness.
- Using `disclose()` deliberately to control what information becomes public.
- Compiling the contract into ZK circuits and deploying it to Preview or Preprod.

### Requirements to Pass

- Midnight toolchain installed and a contract that successfully compiles using `compact compile`.
- Test suite passing successfully.
- Generated `managed/` directory containing the circuits and keys.
- Contract deployed to Preview or Preprod with a visible contract address.
- An initial product idea drafted in the README (one short paragraph).
- Minimum of **5 meaningful commits**.

### Submission Checklist

- Public GitHub repository with a `README.md`.
- Setup instructions explaining how to run the project locally.
- Screenshot showing successful compilation output with the generated circuits listed.
- Screenshot showing the deployed contract with its address.
- README section explaining **public state vs. private witness**.
- Initial product idea paragraph.
- Minimum of **5 meaningful commits**.

---

# Level 2 — Waxing Crescent Submission

### What You Will Learn

- Using the Midnight.js SDK and DApp Connector API.
- Connecting and disconnecting the Lace wallet.
- Calling a circuit from the frontend and handling its result.
- Managing local private state.
- Deploying the dApp to Preprod.

### Requirements to Pass

- Lace wallet connect/disconnect functionality implemented.
- A circuit successfully called from the frontend.
- Observable privacy behavior — something can be proven without revealing the underlying private information.
- Contract deployed to Preprod with a verifiable on-chain address.
- Minimum of **8 meaningful commits**.

### Submission Checklist

- Public GitHub repository with a `README.md`.
- Live demo link hosted on Vercel, Netlify, or a similar platform.
- Deployed Preprod contract address that can be verified on-chain.
- Demo video showing:
  - Lace wallet connection.
  - A successful circuit call.
- README documenting the project's privacy claim.
- Minimum of **8 meaningful commits**.

---

# Level 3 — First Quarter Submission

### What You Will Learn

- Designing a dApp around selective disclosure.
- Writing contract and application tests.
- Setting up a CI/CD pipeline that runs compilation and tests on every push.
- Scoping a realistic product proposal.

### Provided Idea List

Choose **one** of the following:

- **Private Voting** — Anonymous ballots with publicly verifiable tallies.
- **Age / Eligibility Gate** — Prove that a value meets a threshold without revealing the underlying value.
- **Private Allowlist Access** — Prove membership without revealing the user's identity.
- **Confidential Credentials** — Prove that a credential is valid without disclosing the credential itself.
- **Sealed-Bid Auction** — Keep bids private while making the winner verifiable.
- **Private Payroll / Splits** — Distribute funds without exposing individual amounts.
- **Anonymous Feedback / Survey** — Enable verifiable participation while keeping responses private.

### Requirements to Pass

- Fully functional dApp that meaningfully uses Midnight's privacy model.
- Minimum of **3 passing tests**.
- CI/CD pipeline configured with a workflow file and successful runs.
- Approved product idea selected from the provided idea list.
- Minimum of **10 meaningful commits**.

### Submission Checklist

- Public GitHub repository with a complete `README.md`.
- Live demo link.
- Screenshot showing test output with **3 or more tests passing**.
- CI/CD badge or workflow file with successful runs.
- One-minute demo video showing the full functionality of the dApp.
- README **Privacy Model** section explaining:
  - What an observer can learn.
  - What an observer cannot learn.
- Product proposal based on one of the provided ideas, submitted for approval.
- Minimum of **10 meaningful commits**.