##So basically, this file contains the checklist that needs to be followed for submitting the project from Level 1 through Level 3.

We need to make sure that every requirement in this checklist is properly followed, completed, and verified so that the project can successfully pass the Level 1 to Level 3 submission process.

At the bottom of the file, there is also some additional information about the idea submission requirements for Level 4. This section is mainly for understanding what is expected when preparing the Level 4 proposal.

***level 1:
What You Will Learn?
Installing the Midnight toolchain (Compact compiler, proof server, Node 22, Docker),
Writing a Compact contract with public ledger state and a private witness,
Using disclose() deliberately to control what becomes public,
Compiling to ZK circuits and deploying to Preprod.
Requirements to Pass
Toolchain installed and a contract that compiles via compact compile,
Passing test suite,
Generated managed/ directory present (circuits + keys),
Contract deployed to Preview or Preprod with a visible contract address,
An initial product idea (1 short paragraph) drafted in the README,
Minimum 5 meaningful commits.
Submission Checklist
Public GitHub repository with a README.md,
Setup instructions (how to run locally),
Screenshot: successful compile output (circuits listed),
Screenshot: contract deployed with address shown,
README section explaining public state vs private witness,
Initial product idea paragraph,
Minimum 5 meaningful commits.

﻿
***level 2:
What You Will Learn
Midnight.js SDK and the DApp connector API,
Connecting and disconnecting the Lace wallet,
Calling a circuit from the frontend and handling its result,
Managing local private state; deploying to Preprod.
Requirements to Pass
Lace wallet connect / disconnect implemented,
Circuit called successfully from the frontend,
An observable privacy behavior (something proven without being shown),
Contract deployed to Preprod with a verifiable address,
Minimum 8 meaningful commits.
Submission Checklist
Public GitHub repository with README,
Live demo link (Vercel, Netlify, or similar),
Deployed Preprod contract address (verifiable on-chain),
Demo video: wallet connect + a successful circuit call,
README documenting the privacy claim,
Minimum 8 meaningful commits.

***level 3:
What You Will Learn
Designing a dApp around selective disclosure,
Writing contract and application tests,
Setting up a CI/CD pipeline (compile + test on every push),
Scoping a realistic product proposal.
Provided Idea List (choose one)
Private Voting — anonymous ballots with publicly verifiable tallies,
Age / Eligibility Gate — prove a threshold without revealing the underlying value,
Private Allowlist Access — prove membership without revealing identity,
Confidential Credentials — prove a credential is valid without disclosing it,
Sealed-Bid Auction — private bids, verifiable winner,
Private Payroll / Splits — distribute funds without exposing amounts,
Anonymous Feedback / Survey — verifiable participation, private responses.
Requirements to Pass
Fully functional dApp that meaningfully uses Midnight’s privacy model,
Minimum 3 tests passing,
CI/CD pipeline running (workflow file + passing runs),
Approved idea submitted from the provided idea list,
Minimum 10 meaningful commits.
Submission Checklist
Public GitHub repository with complete README,
Live demo link,
Screenshot: test output (3+ tests passing),
CI/CD badge or workflow file with passing runs,
Demo video (1 minute) showing full functionality,
README “privacy model” section: what an observer can and cannot learn,
Product proposal (from the idea list) submitted for approval,
Minimum 10 meaningful commits.

***idea submission for level 4:

Choose a category:

Confidential DeFi

Identity/credentials

Payments

Tokenized assets

Dev tooling

Consumer focus

Gaming

Other
