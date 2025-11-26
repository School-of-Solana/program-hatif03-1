# Votee - Decentralized Voting dApp on Solana

A fully decentralized polling application built on the Solana blockchain that enables users to create polls, register candidates, and cast votes in a transparent and secure manner.

## 🚀 Live Deployment

- **Frontend**: https://votee-solana.vercel.app/
- **Program ID**: `8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee`
- **Network**: Solana Devnet
- **Explorer**: https://explorer.solana.com/address/8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee?cluster=devnet

## 📋 Project Structure

```
program-hatif03-1/
├── anchor_project/          # Solana program (smart contract)
│   ├── programs/           # Rust program code
│   ├── tests/              # Program tests
│   └── migrations/         # Deployment scripts
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   └── lib/           # IDL and types
│   └── public/            # Static assets
└── docs/                   # Documentation files
```

## 🛠️ Tech Stack

### Backend (Solana Program)
- **Anchor Framework** v0.32.0
- **Rust** (latest stable)
- **Solana** Program Library

### Frontend
- **Next.js** 15.1.0
- **TypeScript**
- **React** 19.0.0
- **Tailwind CSS**
- **Solana Web3.js**
- **@coral-xyz/anchor**

## 🚀 Quick Start

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor Framework](https://www.anchor-lang.com/docs/installation)
- [Node.js](https://nodejs.org/) (v18 or later)
- A Solana wallet (Phantom, Solflare, etc.)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd program-hatif03-1
```

### 2. Set Up the Solana Program

```bash
cd anchor_project
npm install
anchor build
```

### 3. Set Up the Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
```

### 4. Run the Application

**Frontend:**
```bash
cd frontend
npm run dev
```

Visit http://localhost:3000

**Program Tests:**
```bash
cd anchor_project
anchor test
```

## 📖 Documentation

- [Project Description](./PROJECT_DESCRIPTION.md) - Detailed project overview and architecture
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Step-by-step deployment instructions
- [Next Steps](./NEXT_STEPS.md) - Post-deployment guide
- [Frontend README](./frontend/README.md) - Frontend-specific documentation
- [Anchor Project README](./anchor_project/README.md) - Program-specific documentation

## ✨ Features

- ✅ Create polls with custom descriptions and date ranges
- ✅ Register candidates for polls
- ✅ Vote for candidates (one vote per user per poll)
- ✅ Real-time vote count updates
- ✅ Wallet integration (Phantom, Solflare, etc.)
- ✅ Transparent on-chain voting records
- ✅ Date validation and voting constraints

## 🔧 Development

### Program Development

```bash
cd anchor_project

# Build
anchor build

# Test
anchor test

# Deploy to devnet
anchor deploy
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## 🧪 Testing

### Program Tests

```bash
cd anchor_project
anchor test
```

Tests cover:
- Happy path scenarios (initialize, create poll, register candidate, vote)
- Error conditions (invalid dates, duplicate voting, etc.)

### Frontend Testing

The frontend can be tested by:
1. Connecting a wallet to Devnet
2. Initializing the program
3. Creating polls
4. Registering candidates
5. Voting

## 📝 Program Instructions

1. **initialize**: Sets up global counter and registrations accounts
2. **create_poll**: Creates a new poll with description and date range
3. **register_candidate**: Registers a candidate for a specific poll
4. **vote**: Casts a vote for a candidate in an active poll

## 🔐 Security Features

- Program Derived Addresses (PDAs) for deterministic account creation
- One vote per user per poll enforcement
- Date validation for poll periods
- Account ownership validation
- Candidate registration validation

## 📊 Program Architecture

The program uses PDAs extensively:
- **Counter PDA**: Tracks total number of polls
- **Registrations PDA**: Tracks total candidate registrations
- **Poll PDA**: Stores poll metadata (one per poll)
- **Candidate PDA**: Stores candidate info and vote count
- **Voter PDA**: Tracks user votes (one per user per poll)

See [PROJECT_DESCRIPTION.md](./PROJECT_DESCRIPTION.md) for detailed architecture documentation.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 🔗 Links

- **Live Frontend**: https://votee-solana.vercel.app/
- **Program Explorer**: https://explorer.solana.com/address/8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee?cluster=devnet
- **Deployment Transaction**: https://explorer.solana.com/tx/4S2GDJcc4MT8Sc9piGrYYRnPYe5ZuMhzo4gxwi2bbNMSciJiQZy13QQfXPonmsHKUkPCQq3G1gAMsksaQcuTjEQ8?cluster=devnet

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review the troubleshooting sections in the guides
3. Check Solana Explorer for program status

---

Built with ❤️ on Solana
