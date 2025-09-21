# AgentHub - AI Agent Marketplace

AgentHub is a decentralized AI Agent Marketplace built on Cardano blockchain. Users can discover, demo, and purchase AI agents using testnet ADA, while creators can deploy and monetize their AI services.

## Features Implemented (Task 1)

✅ **Project Foundation**
- Next.js 15 with TypeScript setup
- TailwindCSS for styling
- MeshJS integration for Cardano wallet connectivity

✅ **Wallet Integration**
- Connect to Cardano wallets (Yoroi, Daedalus, UTXOS)
- Display wallet address and ADA balance
- View all wallet assets and tokens
- Error handling for wallet operations

✅ **Core Components**
- Layout system with Header and Footer
- Wallet information display
- Asset viewer with detailed token information
- Responsive design with dark theme

✅ **Navigation & Pages**
- Home/Marketplace page
- Dedicated Wallet page
- Profile page (placeholder)
- Create Agent page (placeholder)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

4. Connect your Cardano wallet to test the functionality

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx          # Main layout wrapper
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Footer component
│   └── wallet/
│       ├── WalletInfo.tsx  # Wallet details display
│       └── AssetViewer.tsx # Asset/token viewer
├── pages/
│   ├── index.tsx           # Homepage/marketplace
│   ├── wallet.tsx          # Wallet management page
│   ├── profile.tsx         # User profile (placeholder)
│   └── create.tsx          # Agent creation (placeholder)
├── types/
│   └── index.ts            # TypeScript type definitions
└── styles/
    └── globals.css         # Global styles
```

## Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: TailwindCSS
- **Blockchain**: MeshJS for Cardano integration
- **Wallet Support**: Yoroi, Daedalus, UTXOS, and more

## Wallet Requirements

To test the application, you'll need:
- A Cardano wallet extension (Yoroi, Daedalus, etc.)
- Some testnet ADA for future payment features
- Access to Cardano testnet

## Next Steps

The following features are planned for future development:
- AI Agent marketplace with browsing and filtering
- Agent demo functionality
- Payment processing with Masumi
- Creator tools for agent deployment
- Admin dashboard for marketplace management
- NFT ownership layer for agents

## Development

This project follows the AgentHub specification located in `.kiro/specs/agent-marketplace/`. 

Current implementation status: **Task 1 Complete** ✅

## Learn More

- [MeshJS Documentation](https://meshjs.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Cardano Developer Portal](https://developers.cardano.org/)
