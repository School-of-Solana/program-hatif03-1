# Votee Anchor Program

This is the Solana program (smart contract) for the Votee decentralized voting application, built with Anchor framework.

## Program Information

- **Program ID**: `8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee`
- **Network**: Solana Devnet
- **Deployment Signature**: `4S2GDJcc4MT8Sc9piGrYYRnPYe5ZuMhzo4gxwi2bbNMSciJiQZy13QQfXPonmsHKUkPCQq3G1gAMsksaQcuTjEQ8`
- **IDL Account**: `AEXVu8NQJaSrMVnScc4rgVuDYfnYDNV2utfBMavbuxib`
- **Explorer**: https://explorer.solana.com/address/8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee?cluster=devnet

## Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) (latest stable version)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) (v1.18.0 or later)
- [Anchor Framework](https://www.anchor-lang.com/docs/installation) (v0.32.0)
- Node.js and npm

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the program:**
   ```bash
   anchor build
   ```

3. **Run tests:**
   ```bash
   anchor test
   ```

## Deployment

The program is already deployed to Devnet. To redeploy or upgrade:

```bash
# Make sure you're on devnet
solana config set --url devnet

# Build the program
anchor build

# Deploy
anchor deploy
```

## Program Instructions

- **initialize**: Initializes the global counter and registrations accounts
- **create_poll**: Creates a new poll with description, start date, and end date
- **register_candidate**: Registers a candidate for a specific poll
- **vote**: Allows a user to vote for a candidate in an active poll

## Project Structure

```
anchor_project/
├── programs/
│   └── votee/
│       └── src/
│           ├── lib.rs              # Main program entry point
│           ├── instructions/       # Instruction handlers
│           ├── states/             # Account structures
│           ├── errors.rs           # Custom error types
│           └── constants.rs        # Program constants
├── tests/                          # Test files
├── migrations/                     # Deployment scripts
├── Anchor.toml                     # Anchor configuration
└── Cargo.toml                      # Rust dependencies
```

## Testing

Run the test suite:

```bash
# Run all tests
anchor test

# Run tests on devnet (skip local validator)
anchor test --skip-local-validator --provider.cluster devnet
```

## Useful Commands

```bash
# Build the program
anchor build

# Deploy to devnet
anchor deploy

# Generate IDL
anchor idl parse -f programs/votee/src/lib.rs -o target/idl/votee.json

# Check program info
solana program show 8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee --url devnet
```

## Troubleshooting

### Program ID Mismatch Error

If you encounter `DeclaredProgramIdMismatch` error:
1. Run `anchor keys sync` to sync program IDs
2. Or manually update `lib.rs` and `Anchor.toml` to match the keypair

See `FIX_PROGRAM_ID_MISMATCH.md` for detailed instructions.

### Build Errors

If you encounter build errors:
1. Make sure Rust toolchain is up to date: `rustup update`
2. Clean and rebuild: `anchor clean && anchor build`
3. Check `rust-toolchain.toml` for the correct Rust version

## License

MIT License
