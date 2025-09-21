# Cardano AI CIP Agent

An educational TypeScript CLI agent that can:

1. Draft structured Cardano Improvement Proposal (CIP) scaffolds using Google Gemini.
2. Query Cardano Preprod blockchain data (balance, UTXOs, transactions) via Blockfrost.
3. Build, sign, and submit simple ADA transfer transactions on Preprod using Lucid.

> Safety: All blockchain operations are locked to the Preprod test network. Do **NOT** place mainnet keys or funds in the provided mnemonic.

## Features
- Modular "tools" pattern similar to CrewAI style.
- Clear logs for hackathon demos.
- Extensible command parser (add more tools easily).
- Strong TypeScript types and inline comments.

## Project Structure (Minimal)
```
agent.ts                 # CLI loop & tool registry (root for simplicity)
src/tools/
  geminiTool.ts          # draftCip (Gemini model)
  queryTool.ts           # getBalance, getUtxos, getTransactions
  txTool.ts              # sendAda (Lucid + Blockfrost)
.env.example             # Template for required environment variables
package.json             # Scripts & dependencies
tsconfig.json            # TypeScript config
```

## Environment Variables
Copy `.env.example` to `.env` and fill in:
```
GEMINI_API_KEY=...
BLOCKFROST_API_KEY=...
CARDANO_NETWORK=Preprod
WALLET_MNEMONIC=24 words (TESTNET ONLY)
```
`CARDANO_NETWORK` is enforced as `Preprod` in code. If it differs, the agent will exit.

## Install & Build
```bash
pnpm install
pnpm run build   # emit dist/
```

## Run (Options)
```bash
# After build (recommended)
pnpm start

# Direct TS (ESM loader)
pnpm run run:ts

# Dev hot reload (nodemon, optional)
pnpm run dev
```

## Commands (enter at prompt)
```
draft_cip topic="Light wallet metadata sync"
get_balance address="addr_test..."
get_utxos address="addr_test..."
get_txs address="addr_test..." limit=5
send_ada to="addr_test..." amount=1.5
masumi_status
masumi_list
exit
```

## CIP Drafting
The `draft_cip` command returns a structured Markdown scaffold with:
- Title suggestion
- Abstract
- Motivation
- Specification outline
- Backwards Compatibility
- Security Considerations
- Reference Implementation Pointers

## Transaction Notes
- Only simple ADA outputs (no multi-asset) for clarity.
- Fee calculated automatically.
- Amount is in ADA (converted internally to lovelace).
- Basic balance + UTXO sufficiency checks.

## Extending
Add new file in `src/tools` exporting a function, register in `agent.ts` tool map, give it a parse rule.

## Masumi Integration
If you cloned the Masumi services quickstart inside this project:
1. In `masumi-services-dev-quickstart` copy `.env.example` to `.env` and fill required keys.
2. Start services:
```bash
docker compose -f masumi-services-dev-quickstart/docker-compose.yml up -d
```
3. Use commands:
```
masumi_status  # Health for registry + payment services
masumi_list    # Attempts to list agents (best-effort; depends on endpoint availability)
```
Environment overrides: `MASUMI_REGISTRY_URL`, `MASUMI_PAYMENT_URL`.

### Windows One-Liners
Start Masumi services:
```
start-masumi.cmd
```
Then run agent:
```
run-agent.cmd
```

## Disclaimer
Educational / hackathon demo code. Not production hardened. Use at your own risk.

## License
MIT
