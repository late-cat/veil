###So, this is the audit file I created based on the checklist and the building-instruction file.

The audit prompt is designed to be reusable, tweakable, and customizable. We can use it as a base template for different projects and adapt it according to the specific project's requirements, checklist, architecture, and submission criteria.

Before conducting an actual audit, this prompt should always be customized for the specific project. The agent can then use the customized audit prompt to evaluate whether the project has actually completed the required work, followed the relevant checkpoints, and is ready for submission.

In short, this is a reusable audit framework that helps systematically verify a project's implementation against its required checklist and building instructions. It is not meant to be used unchanged for every project; it should be customized first and then used to conduct the audit.

# Midnight Builder Challenge — Level 1 to Level 3 Compliance Audit Prompt

> **Purpose:** Use this prompt to audit ANY Midnight Builder Challenge project against the official Level 1, Level 2, and Level 3 submission requirements. Paste this into your AI assistant (Claude, Cursor, Antigravity, etc.) along with the project path to receive a brutally honest compliance report.
>
> **Source of Truth:** This prompt was derived from the official `levels-checklist.md` and `midnight_prompts.md` documents provided by the Midnight Builder Challenge on Rise In.

---

## HOW TO USE

1. Copy this entire file.
2. Paste it into your AI assistant.
3. Replace `[PROJECT_PATH]` with the absolute path to the project you want to audit.
4. Replace `[PROJECT_NAME]` with the name of the project (e.g., "JKRS", "ZKRx", etc.).
5. The AI will inspect, verify, and report — without modifying any files.

---

## AUDIT PROMPT — START

You are auditing the **veil** project for the Midnight Builder Challenge.

**Project path:** `/Users/bapi/new-moon-stellar`

Your job is to determine whether the project satisfies the **official Midnight Builder Challenge requirements for Level 1, Level 2, and Level 3**.

**CRITICAL RULES:**
- Do NOT modify any files.
- Do NOT write or generate code.
- Do NOT refactor anything.
- Do NOT fix anything.
- ONLY inspect, verify, and report.
- Audit the ACTUAL implementation, not just the README.
- If something cannot be verified from the code, mark it **UNVERIFIED**.
- Do not give credit for placeholders, empty sections, or claims unsupported by code.
- Trace the actual data flow through the system — from user input → frontend → Compact circuit → ZK proof → Midnight ledger.

---

# PHASE 1: REPOSITORY INSPECTION

Inspect the entire project before drawing any conclusions. Read and understand:

- [ ] Compact contract source file(s) (e.g., `contracts/*.compact` or similar)
- [ ] `managed/` directory (generated circuits, keys)
- [ ] Frontend source (`src/`, `web-dapp/`, or similar)
- [ ] Midnight.js SDK integration code
- [ ] Wallet connection code (Lace / 1A.M.)
- [ ] Test file(s)
- [ ] `package.json` (scripts, dependencies)
- [ ] `.github/workflows/ci.yml`
- [ ] `README.md`
- [ ] `PROPOSAL.md`
- [ ] Environment / configuration files
- [ ] Deployment configuration (Vercel, Netlify, etc.)

---

# PHASE 2: LEVEL 1 — NEW MOON (Setup & First Contract)

Verify each requirement from the official Level 1 checklist:

### Contract
- [ ] A Compact contract exists (`.compact` file).
- [ ] The contract compiles with `compact compile` (or equivalent build command).
- [ ] `managed/` directory exists with generated circuits and keys (`.pk`, `.vk`, BZKIR bytecodes).
- [ ] At least one piece of **public ledger state** exists in the contract.
- [ ] At least one **private witness** exists as a circuit input.
- [ ] `disclose()` is used deliberately to control what information becomes public.
- [ ] A comment or section explains what is public vs. private.

### Tests
- [ ] At least **3 passing tests** exist.
- [ ] Tests cover **circuit logic** (does the circuit compute correctly?).
- [ ] Tests cover **state transitions** (does ledger state update as expected?).
- [ ] Tests cover **privacy** (private input is never exposed in any output).
- [ ] Tests actually pass when run.

### Deployment
- [ ] Contract is deployed to **Preview or Preprod**.
- [ ] A visible **contract address** exists.
- [ ] The contract address is documented in `README.md`.

### README (Level 1 sections)
- [ ] Project description (what the contract does).
- [ ] Contract address table.
- [ ] Privacy Model section (public vs. private explanation).
- [ ] Tech Stack section.
- [ ] Prerequisites section.
- [ ] Setup / installation instructions.
- [ ] Run Tests section (command to run tests).
- [ ] Initial product idea (at least one paragraph).
- [ ] Screenshot: successful compilation output.
- [ ] Screenshot: deployed contract address.

### Commits
- [ ] Minimum **5 meaningful commits** in git history.

---

# PHASE 3: LEVEL 2 — WAXING CRESCENT (Frontend Integration)

Verify each requirement from the official Level 2 checklist:

### Frontend
- [ ] A React/Vite or Next.js frontend exists.
- [ ] Midnight.js SDK is installed and integrated.
- [ ] DApp Connector API is used for wallet interaction.
- [ ] Frontend is connected to the actual deployed Midnight contract.

### Wallet Connection (Lace / 1A.M.)
- [ ] Connect button triggers wallet connection.
- [ ] Disconnect button clears wallet state.
- [ ] Connected wallet address is displayed on screen.
- [ ] Clear disconnected state is shown when not connected.
- [ ] Error handled: wallet not installed.
- [ ] Error handled: user rejected connection.
- [ ] Error handled: network mismatch.

### Circuit Interaction
- [ ] A circuit is called from the frontend (not simulated).
- [ ] Proof is generated (locally or via proof server).
- [ ] Result is submitted on-chain.
- [ ] Loading state is shown during proof generation.
- [ ] Transaction result is displayed after submission.
- [ ] Private inputs are **NEVER** displayed in the UI.
- [ ] A privacy label or message exists (e.g., "Proved without revealing your input").

### Deployment
- [ ] Frontend deployment config exists (vercel.json, netlify.toml, or similar).
- [ ] The live URL connects to the Preprod contract.
- [ ] **Live demo link** is documented in README.

### README (Level 2 sections)
- [ ] Live Demo section with URL.
- [ ] Contract Address (mandatory — not blank).
- [ ] What This Does section.
- [ ] Privacy Model section.
- [ ] Privacy Claim section (what observer sees vs. cannot see).
- [ ] Tech Stack section.
- [ ] Prerequisites section (including Lace wallet).
- [ ] Run Locally section (step-by-step commands).
- [ ] Demo Video section (link or placeholder).

### Demo Video
- [ ] Demo video exists or link is provided.
- [ ] Video shows: wallet connection.
- [ ] Video shows: a successful circuit call.
- [ ] Video shows: proof generation and on-chain result.

### Commits
- [ ] Minimum **8 meaningful commits** in git history.

---

# PHASE 4: LEVEL 3 — FIRST QUARTER (Production-Grade dApp)

Verify each requirement from the official Level 3 checklist:

### Tests
- [ ] At least **3 passing tests** exist.
- [ ] Tests cover circuit logic.
- [ ] Tests cover state transitions.
- [ ] Tests cover privacy behavior.
- [ ] All tests pass when executed.

### CI/CD Pipeline
- [ ] `.github/workflows/ci.yml` exists.
- [ ] Triggers on: push to `main`.
- [ ] Triggers on: pull request.
- [ ] Installs Node.js v22.
- [ ] Runs `npm install`.
- [ ] Runs `compact compile` (or equivalent compilation step).
- [ ] Runs the test suite.
- [ ] CI status badge exists at the top of `README.md`.
- [ ] CI pipeline has at least one **successful run**.

### DApp Quality
- [ ] All error states have clear user-facing messages.
- [ ] Loading spinner/indicator exists during proof generation.
- [ ] Privacy behavior is clearly labeled in the UI.
- [ ] Mobile-responsive layout exists.
- [ ] Production build succeeds with zero errors (`npm run build`).
- [ ] No obvious console errors in production.

### PROPOSAL.md
- [ ] File exists in the project root.
- [ ] Section: "What is the product, and who uses it?"
- [ ] Section: "Why Midnight specifically?"
- [ ] Section: "Data Model" (table with public/private data points).
- [ ] Section: "Mainnet Feasibility."
- [ ] Proposal claims match the actual implementation (flag any discrepancies).

### README (Level 3 sections)
- [ ] CI badge at the top.
- [ ] Live Demo link.
- [ ] Contract Address (mandatory).
- [ ] Privacy Model with "observer" framing (what can/cannot be learned).
- [ ] Product Proposal reference.

### Commits
- [ ] Minimum **10 meaningful commits** in git history.

---

# PHASE 5: CRITICAL ZK PRIVACY AUDIT

This is the most important phase. Do not simply grep for keywords like `private`, `witness`, or `disclose()`. Understand the actual circuit logic.

### Determine:

**What is PUBLIC?**
List every public ledger state value in the contract.

**What is PRIVATE?**
List every private witness / private input.

**What does the ZK circuit prove?**
Explain in plain English what each circuit proves.

**What is disclosed?**
Identify every use of `disclose()` and explain why it is necessary.

**What reaches the blockchain?**
Check whether sensitive information appears in: ledger state, transaction data, public parameters, events, disclosed values.

**What reaches the browser?**
Check whether sensitive information appears in: UI text, console logs, localStorage, sessionStorage, network requests, API calls.

---

# PHASE 6: DETECT SUPERFICIAL IMPLEMENTATION

Be skeptical. Specifically check whether:

- [ ] A normal hash comparison is being called a "ZK proof."
- [ ] A client-side check is being presented as ZK verification.
- [ ] Proof generation is mocked (e.g., `setTimeout` + hardcoded result).
- [ ] Authenticity/result is hardcoded.
- [ ] Blockchain transactions are mocked or simulated.
- [ ] Wallet connection is mocked.
- [ ] Contract calls are simulated (never actually submitted on-chain).
- [ ] The contract exists but the frontend never actually calls it.
- [ ] The frontend uses a different contract than what README documents.
- [ ] Private data is accidentally stored in localStorage or displayed in UI.
- [ ] `disclose()` exposes sensitive data that should remain private.
- [ ] Tests don't meaningfully test privacy or state transitions.
- [ ] README claims functionality that doesn't exist in code.
- [ ] Placeholder or TODO code is treated as finished implementation.

If you find anything suspicious, provide the **exact file, function, and line** responsible.

---

# PHASE 7: SCORECARD

Create this exact table, filling in evidence and status for each row:

| Requirement | Evidence | Status |
|---|---|---|
| **LEVEL 1** | | |
| Compact contract exists | | ✓ / ⚠ / ✗ / ? |
| Contract compiles | | ✓ / ⚠ / ✗ / ? |
| `managed/` directory exists | | ✓ / ⚠ / ✗ / ? |
| Public ledger state | | ✓ / ⚠ / ✗ / ? |
| Private witness | | ✓ / ⚠ / ✗ / ? |
| `disclose()` used deliberately | | ✓ / ⚠ / ✗ / ? |
| 3+ tests passing | | ✓ / ⚠ / ✗ / ? |
| Contract deployed | | ✓ / ⚠ / ✗ / ? |
| Contract address in README | | ✓ / ⚠ / ✗ / ? |
| Privacy explanation | | ✓ / ⚠ / ✗ / ? |
| 5+ meaningful commits | | ✓ / ⚠ / ✗ / ? |
| **LEVEL 2** | | |
| Frontend exists | | ✓ / ⚠ / ✗ / ? |
| Midnight.js SDK integrated | | ✓ / ⚠ / ✗ / ? |
| Wallet connect/disconnect | | ✓ / ⚠ / ✗ / ? |
| Circuit called from frontend | | ✓ / ⚠ / ✗ / ? |
| Proof generated | | ✓ / ⚠ / ✗ / ? |
| On-chain result submitted | | ✓ / ⚠ / ✗ / ? |
| Private inputs hidden from UI | | ✓ / ⚠ / ✗ / ? |
| Live demo link | | ✓ / ⚠ / ✗ / ? |
| Demo video | | ✓ / ⚠ / ✗ / ? |
| 8+ meaningful commits | | ✓ / ⚠ / ✗ / ? |
| **LEVEL 3** | | |
| 3+ meaningful tests | | ✓ / ⚠ / ✗ / ? |
| CI/CD pipeline exists | | ✓ / ⚠ / ✗ / ? |
| CI triggers on push + PR | | ✓ / ⚠ / ✗ / ? |
| CI runs compile + tests | | ✓ / ⚠ / ✗ / ? |
| CI badge in README | | ✓ / ⚠ / ✗ / ? |
| CI has successful run | | ✓ / ⚠ / ✗ / ? |
| Production build succeeds | | ✓ / ⚠ / ✗ / ? |
| Error handling in UI | | ✓ / ⚠ / ✗ / ? |
| Mobile responsive | | ✓ / ⚠ / ✗ / ? |
| PROPOSAL.md complete | | ✓ / ⚠ / ✗ / ? |
| Privacy Model (observer framing) | | ✓ / ⚠ / ✗ / ? |
| 10+ meaningful commits | | ✓ / ⚠ / ✗ / ? |

**Legend:** ✓ = Pass | ⚠ = Partial/Warning | ✗ = Fail | ? = Unverified

---

# PHASE 8: FINAL VERDICT

### Project Alignment
Choose one:
- **🟢 ALIGNED** — The project genuinely implements its claimed privacy-preserving use case using Midnight.
- **🟡 PARTIALLY ALIGNED** — The contract/circuit is genuine but the frontend or tests have gaps.
- **🔴 NOT ALIGNED** — The ZK implementation is superficial or mocked.

### Level Scores
```
Level 1: X/11 requirements passed
Level 2: X/10 requirements passed
Level 3: X/12 requirements passed
```

### ZK Privacy Verdict
**Does the implementation provide genuine privacy-preserving ZK verification?**
Answer: **YES / PARTIALLY / NO / UNVERIFIED**

### Submission Readiness
Choose one:
- **🟢 READY** — All critical requirements met. Submit now.
- **🟡 READY AFTER FIXES** — Minor issues to address. List them.
- **🔴 NOT READY** — Critical blockers exist. List them.

---

# PHASE 9: TOP 5 FINDINGS

List only the **5 most important findings**. For each:

```
Issue: [description]
Evidence: [exact file/line/function]
Requirement Affected: [which Level/requirement]
Severity: Critical / High / Medium / Low
```

---

# PHASE 10: ACTION LIST

List the **5 highest-priority things to fix or verify** before submission.

Every recommendation MUST be based on something actually found during the audit. Do NOT give generic advice.

---

## FINAL RULE

You are an **auditor, not a developer**. Do not touch the project. Do not fix anything. Do not generate code. Inspect, verify, and report — brutally and honestly.

**Start the audit now.**
