# Agent Handoff — VEIL Protocol (Midnight Builder Challenge)

## Project Overview

**VEIL Protocol** is an anonymous feedback/survey dApp built on the **Midnight Network** (a Zero-Knowledge privacy blockchain). The user is participating in the **Midnight Builder Challenge on Rise In** and needs to complete **Levels 1-3** minimum.

- **Repo:** `/Users/bapi/new-moon-stellar` (GitHub: `late-cat/veil`)
- **Requirements doc:** [levels.md](file:///Users/bapi/new-moon-stellar/levels.md)
- **Prompts doc:** [midnight_prompts.md](file:///Users/bapi/new-moon-stellar/midnight_prompts.md)
- **Challenge idea chosen:** "Anonymous Feedback / Survey" from Level 3's provided idea list

---

## Architecture

```
/Users/bapi/new-moon-stellar/
├── backend/                    ← Midnight contract + deploy scripts
│   ├── contracts/
│   │   └── survey.compact      ← The Compact ZK contract
│   ├── contracts/managed/survey/ ← Compiled ZK circuits (committed to git)
│   ├── src/
│   │   ├── deploy.ts           ← Main deploy script (HEAVILY MODIFIED — see below)
│   │   ├── wallet.ts           ← Wallet facade construction
│   │   ├── wallet-state.ts     ← Wallet state persistence
│   │   ├── network.ts          ← Network configs (undeployed/preview/preprod)
│   │   └── check-balance.ts    ← Balance checker utility
│   ├── docker-compose.yml      ← Local devnet (node + indexer + proof-server)
│   ├── .midnight-state.json    ← Wallet seeds, deployment records
│   └── package.json
├── frontend/                   ← Next.js app (deployed to Vercel)
│   ├── src/
│   │   ├── app/page.tsx        ← Landing page
│   │   ├── components/         ← Navbar etc.
│   │   └── providers/MidnightProvider.tsx ← Wallet connection provider
│   └── package.json
└── .github/workflows/
    └── contracts.yml           ← CI/CD pipeline
```

---

## What's Been Accomplished

### ✅ Done
- Smart contract (`survey.compact`) written, compiles successfully
- Compiled artifacts committed to git (`backend/contracts/managed/survey/`)
- TypeScript compiles with zero errors (`npx tsc --noEmit` passes)
- Frontend UI built (Next.js) with beautiful landing page + dashboard
- Frontend deployed to **Vercel** (needs contract address env var to be functional)
- CI/CD pipeline set up (`.github/workflows/contracts.yml`)
- Local devnet deployment worked (contract address in `.midnight-state.json` under `undeployed`)
- Wallet for preprod created and persisted (seed + mnemonic in `.midnight-state.json`)
- **Wallet funded with 5,000 tNIGHT** on preprod via faucet (confirmed via screenshot + deploy script output)
- Docker containers configured and currently running

### ⏳ In Progress — CRITICAL
- **Preprod contract deployment is currently running** as background task `task-3014`
- Log file: `/Users/bapi/.gemini/antigravity-ide/brain/a49736ea-0896-46dd-9cdd-8246024f6e40/.system_generated/tasks/task-3014.log`
- Command: `NODE_OPTIONS="--max-old-space-size=12288" MIDNIGHT_SYNC_TIMEOUT_MS=600000 npx tsx src/deploy.ts --network preprod`
- Started at approximately 02:57 IST on Sep 11, 2026
- The 10-minute sync timeout will fire at ~03:07 IST, then it should proceed to DUST + deploy

### ❌ Not Yet Done
- Tests (minimum 3 required for Level 3)
- PROPOSAL.md
- Demo video
- README.md updates with contract address
- Vercel env var `NEXT_PUBLIC_CONTRACT_ADDRESS` needs to be set
- Commit count needs to reach 10+ meaningful commits

---

## The Deployment Battle — What Went Wrong & What We Fixed

### Problem 1: `waitForSyncedState()` hangs forever
The Midnight SDK's `waitForSyncedState()` requires ALL 3 sub-wallets (Shielded, Unshielded, Dust) to report `isSynced = true`. On an idle testnet, the Dust wallet never completes. This caused the script to hang for 18+ minutes repeatedly.

**Fix applied in [deploy.ts](file:///Users/bapi/new-moon-stellar/backend/src/deploy.ts):**
- Added `Promise.race()` with a configurable timeout (`MIDNIGHT_SYNC_TIMEOUT_MS` env var, defaults to 10 min for public networks)
- On timeout, grabs whatever state is available via `Rx.firstValueFrom(walletCtx.wallet.state())`

### Problem 2: Docker proof-server was dead
The proof-server container had been exited for 2 days. Even if sync completed, deployment would fail at the "Checking proof server..." step.

**Fix:** `docker compose up -d --wait` in `/Users/bapi/new-moon-stellar/backend/`

### Problem 3: Downstream `isSynced` filters also hang
After the sync timeout, `isSynced` stays `false` forever. But the deploy script had multiple `Rx.filter((s) => s.isSynced)` calls in:
- Faucet poll section (line ~224)
- DUST state fetch (line ~261)
- DUST balance wait (line ~283)

**Fix applied:** Removed all downstream `isSynced` filters. The faucet poll now uses the already-known balance variable instead of re-querying. DUST steps grab state without the isSynced requirement.

### Problem 4: `NODE_OPTIONS` not used
The `midnight_prompts.md` specifies `NODE_OPTIONS="--max-old-space-size=12288"` but it was never used. Now included in the deploy command.

### Problem 5: No saved wallet state for preprod
`.midnight-wallet-state/preprod/` doesn't exist — every restart syncs from genesis. Once deployment succeeds, `persistWalletState()` will create it, making future syncs fast.

---

## Docker Status (as of ~02:41 IST Sep 11)

All 3 containers running and healthy:
```
mn-demo-proof-server   Up (healthy)   0.0.0.0:6300->6300/tcp
mn-demo-indexer        Up (healthy)   0.0.0.0:8088->8088/tcp
mn-demo-node           Up (healthy)   0.0.0.0:9944->9944/tcp
```

> [!WARNING]
> These are LOCAL devnet containers. For preprod deployment, only the **proof-server** (port 6300) is needed locally. The RPC node and indexer are remote (`rpc.preprod.midnight.network`, `indexer.preprod.midnight.network`).

---

## Key Files Modified

| File | What Changed |
|------|-------------|
| [deploy.ts](file:///Users/bapi/new-moon-stellar/backend/src/deploy.ts) | Sync timeout, isSynced filter removal, address printed before sync, witness type fix |
| [docker-compose.yml](file:///Users/bapi/new-moon-stellar/backend/docker-compose.yml) | Original, unchanged |
| [network.ts](file:///Users/bapi/new-moon-stellar/backend/src/network.ts) | Original, unchanged |
| [wallet.ts](file:///Users/bapi/new-moon-stellar/backend/src/wallet.ts) | Original, unchanged |
| [.midnight-state.json](file:///Users/bapi/new-moon-stellar/backend/.midnight-state.json) | Has preprod wallet seed + local deployment record |

---

## What the Next Agent Must Do

### Immediate: Check if deployment succeeded
1. Check task `task-3014` log for output after the 10-minute timeout
2. Look for `✅ Contract deployed successfully!` and the `Contract Address: ...`
3. If it succeeded → record the address, update README, set Vercel env var
4. If it failed → read the error, fix, and retry

### If deployment succeeded:
1. Update `.midnight-state.json` with the preprod deployment record
2. Set `NEXT_PUBLIC_CONTRACT_ADDRESS=<address>` on Vercel
3. Trigger Vercel redeployment
4. Write 3+ tests in `backend/tests/`
5. Create `PROPOSAL.md`
6. Update `README.md` with contract address, privacy model, etc.
7. Record demo video checklist
8. Ensure 10+ meaningful git commits

### If deployment failed:
- Check the exact error message
- Common issues: DUST shortage (retry with delay), proof server timeout, RPC disconnection
- The deploy script has a 20-retry loop for DUST shortages built in

---

## Wallet Info

| Field | Value |
|-------|-------|
| Network | preprod |
| Address | `mn_addr_preprod1pr0sqjn9m490nk7nj62m3qrgty90dfn5mp0wsz8p4t68c7p3jrasc07yvf` |
| Balance | 5,000 tNIGHT (5,000,000,000 raw units) |
| Seed | In `.midnight-state.json` |
| Mnemonic | In `.midnight-state.json` |

---

## Level Requirements Checklist

### Level 1 (New Moon)
- [x] Toolchain installed (compact compiler, proof server, Node 22, Docker)
- [x] Contract compiles via `compact compile`
- [x] `managed/` directory present
- [ ] Contract deployed to Preview or Preprod ← **IN PROGRESS**
- [ ] Contract address in README
- [ ] Initial product idea in README
- [ ] 5+ meaningful commits

### Level 2 (Waxing Crescent)
- [x] Frontend built (Next.js)
- [x] Wallet connect UI (MidnightProvider.tsx)
- [ ] Circuit called from frontend
- [ ] Live demo link in README
- [ ] Demo video
- [ ] 8+ meaningful commits

### Level 3 (First Quarter)
- [x] Chosen idea: "Anonymous Feedback / Survey"
- [x] CI/CD pipeline
- [ ] 3+ tests passing
- [ ] PROPOSAL.md
- [ ] Demo video (1 min)
- [ ] Privacy model section in README
- [ ] 10+ meaningful commits
