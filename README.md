# AgentHub - AI Agent Marketplace

**Team TESSERACT**

A decentralized marketplace for AI agents built on Cardano blockchain, enabling users to discover, demo, and purchase AI agents with secure cryptocurrency payments.

## 🚀 Project Description

AgentHub is a revolutionary platform that bridges the gap between AI developers and users by creating a decentralized marketplace where:

- **AI Developers** can publish, monetize, and distribute their AI agents
- **Users** can discover, test through demos, and purchase AI agents using Cardano (ADA)
- **Secure Transactions** are handled through Cardano blockchain integration
- **Quality Assurance** through agent approval and rating systems

## 🎯 Problem We're Solving

### Current Challenges in AI Agent Distribution:
1. **Fragmented Ecosystem**: AI agents are scattered across different platforms with no unified marketplace
2. **Trust Issues**: Users can't test agents before purchasing, leading to poor user experience
3. **Payment Friction**: Complex payment systems and lack of cryptocurrency integration
4. **Developer Monetization**: Limited options for AI developers to monetize their creations
5. **Discovery Problem**: Difficult for users to find quality AI agents suited to their needs

### Our Solution:
AgentHub creates a **unified, trustworthy, and user-friendly marketplace** that:
- Provides **free demos** before purchase
- Enables **secure cryptocurrency payments**
- Offers **comprehensive agent discovery** with filtering and search
- Supports **developer monetization** through direct sales
- Ensures **quality control** through approval processes

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework for production
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - Modern state management

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLite** - Lightweight database for development
- **Pydantic** - Data validation and serialization
- **Uvicorn** - ASGI server

### Blockchain Integration
- **Cardano** - Blockchain platform for secure transactions
- **Mesh SDK** - Cardano wallet integration
- **Wallet Connectors** - Support for multiple Cardano wallets

### Development Tools
- **ESLint** - Code linting and formatting
- **Git** - Version control
- **VS Code** - Development environment

## 📸 Project Demo

### Screenshots

#### 1. Marketplace Homepage
*Browse and discover AI agents with advanced filtering*

#### 2. Agent Profile Page
*Detailed agent information with demo functionality*

#### 3. Demo Interface
*Try agents before purchasing with limited functionality*

#### 4. Wallet Integration
*Secure Cardano wallet connection and payments*

### Demo Video
🎥 **[Project Demo Video]** - *Coming Soon*

### Live Demo
🌐 **[Live Application]** - *Coming Soon*

## 📋 Key Features Implemented

### ✅ Core Marketplace Features
- Agent listing and discovery
- Advanced filtering (category, price, rating)
- Search functionality
- Agent profiles with detailed information

### ✅ Demo System
- **Free agent demos** with usage limits
- **Interactive demo interface** with dynamic input forms
- **Usage tracking** per user wallet
- **Demo limits enforcement** to prevent abuse
- **Purchase prompts** after demo completion

### ✅ Wallet Integration
- Cardano wallet connection
- Multi-wallet support (Nami, Eternl, etc.)
- Wallet balance display
- Asset viewing capabilities

### ✅ Backend API
- RESTful API with FastAPI
- Agent management endpoints
- Demo execution system
- Database integration with SQLite
- Comprehensive error handling

### ✅ Database Design
- Agents table with full metadata
- Jobs table for demo/execution tracking
- User management system
- Transaction logging

## 🏗️ Project Structure

```
AgentHub/
├── agenthub/                 # Frontend Next.js application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── agents/       # Agent-specific components
│   │   │   ├── marketplace/  # Marketplace components
│   │   │   └── wallet/       # Wallet integration
│   │   ├── pages/           # Next.js pages
│   │   ├── lib/             # Utilities and API clients
│   │   └── types/           # TypeScript type definitions
├── backend/                 # FastAPI backend
│   ├── main.py             # Main application
│   ├── database.py         # Database utilities
│   ├── config.py           # Configuration
│   └── requirements.txt    # Python dependencies
├── .kiro/                  # Project specifications
│   └── specs/
│       └── agent-marketplace/
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/jaideep-27/tesseract.git
cd tesseract
```

2. **Setup Frontend**
```bash
cd agenthub
npm install
npm run dev
```

3. **Setup Backend**
```bash
cd backend
pip install -r requirements.txt
python start_server.py
```

4. **Initialize Database**
```bash
python database.py
```

### Running the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 🧪 Testing

### Demo Functionality Testing
Run the comprehensive test suite:
```bash
python test_demo_functionality.py
```

This validates:
- Demo endpoint functionality
- Usage limit enforcement
- Anonymous demo support
- Error handling

## 📊 Project Presentation

### 📎 PPT Link
**[Team TESSERACT - AgentHub Presentation](https://drive.google.com/drive/folders/1actu1EBJ2QV3lD3JN3OHj9Z-KZJWJqXU?usp=drive_link)**

*The presentation covers our project vision, technical architecture, demo walkthrough, and future roadmap.*

## 👥 Team Members

### Team TESSERACT

| Name | Role | Contribution |
|------|------|-------------|
| **Jaideep Amrabad** | Team Lead & Full-Stack Developer | Project architecture, backend API development, database design |
| **Sai Teja** | Frontend Developer | React components, UI/UX design, wallet integration |
| **Avinash** | Backend Developer | FastAPI implementation, demo system, testing |
| **Bhanu Prasad** | Blockchain Developer | Cardano integration, wallet connectivity, smart contracts |
| **Anusha** | Frontend Developer | Component development, styling, user experience |
| **Shivarama** | DevOps & Testing | Deployment, testing automation, documentation |

## 🔮 Future Roadmap

### Phase 1 (Current)
- ✅ Basic marketplace functionality
- ✅ Demo system implementation
- ✅ Wallet integration

### Phase 2 (Next)
- 🔄 Payment processing with Cardano
- 🔄 Agent execution environment
- 🔄 Rating and review system

### Phase 3 (Future)
- 📋 Advanced agent analytics
- 📋 Developer dashboard
- 📋 Mobile application
- 📋 Multi-chain support

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines and feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Cardano Foundation for blockchain infrastructure
- Mesh SDK team for wallet integration tools
- FastAPI and Next.js communities for excellent frameworks
- Our mentors and advisors for guidance

---

**Built with ❤️ by Team TESSERACT**

*Revolutionizing AI agent distribution through blockchain technology*