# Deploy to Solana Devnet (Testnet)

## Quick Steps

### 1. Prerequisites Check

```bash
# Make sure Solana CLI is installed and configured
solana --version

# Make sure Anchor is installed
anchor --version

# Set Solana CLI to devnet
solana config set --url devnet

# Check your wallet address
solana address

# Check your balance (you need SOL for deployment)
solana balance

# If you need SOL, request an airdrop
solana airdrop 2
```

### 2. Build the Program

```bash
cd anchor_project

# Build the program
anchor build
```

This will:
- Compile your Rust program
- Generate the IDL file
- Generate TypeScript types
- Create the program binary at `target/deploy/votee.so`

### 3. Deploy to Devnet

```bash
# Deploy to devnet
anchor deploy --provider.cluster devnet
```

**Important:**
- This will deploy your program and may output a new program ID
- **Copy the program ID** that gets printed
- Deployment typically costs 2-3 SOL
- If you get "insufficient funds", run `solana airdrop 2` again

### 4. Update Program ID (if needed)

If the deployment outputs a different program ID than what's in your code:

**Update `anchor_project/programs/votee/src/lib.rs`:**
```rust
declare_id!("YOUR_NEW_PROGRAM_ID_HERE");
```

**Update `anchor_project/Anchor.toml`:**
```toml
[programs.devnet]
votee = "YOUR_NEW_PROGRAM_ID_HERE"
```

**Then rebuild and redeploy:**
```bash
anchor build
anchor deploy --provider.cluster devnet
```

### 5. Verify Deployment

```bash
# Check your program on Solana Explorer
# Replace YOUR_PROGRAM_ID with your actual program ID
# Visit: https://explorer.solana.com/address/YOUR_PROGRAM_ID?cluster=devnet

# Or check via CLI
solana program show YOUR_PROGRAM_ID --url devnet
```

### 6. Initialize the Program (if needed)

After deployment, you may need to initialize the program:

```bash
# Make sure you're on devnet
solana config set --url devnet

# Run initialize (if you have a script)
anchor run initialize --provider.cluster devnet
```

Or use the frontend to initialize by creating your first poll.

## Troubleshooting

### "Insufficient funds"
```bash
solana airdrop 2
```

### "Program already deployed"
- The program ID is already in use
- Generate a new keypair:
  ```bash
  solana-keygen new -o target/deploy/votee-keypair.json
  ```
- Update the program ID in `lib.rs` and `Anchor.toml`
- Rebuild and redeploy

### "Connection refused" or RPC errors
- Try a different RPC endpoint
- Update your Solana config:
  ```bash
  solana config set --url https://api.devnet.solana.com
  ```

## Next Steps

After successful deployment:

1. **Update frontend configuration:**
   - Create `frontend/.env.local` with:
     ```
     NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
     NEXT_PUBLIC_PROGRAM_ID=YOUR_PROGRAM_ID_HERE
     ```

2. **Test the deployment:**
   ```bash
   anchor test --skip-local-validator --provider.cluster devnet
   ```

3. **View on Solana Explorer:**
   - Visit: `https://explorer.solana.com/address/YOUR_PROGRAM_ID?cluster=devnet`

## Useful Commands

```bash
# Anchor commands
anchor build                                    # Build the program
anchor deploy --provider.cluster devnet        # Deploy to devnet
anchor test --skip-local-validator --provider.cluster devnet  # Test on devnet

# Solana commands
solana config set --url devnet                 # Switch to devnet
solana address                                 # Show wallet address
solana balance                                 # Check SOL balance
solana airdrop 2                               # Request 2 SOL airdrop
solana program show <PROGRAM_ID> --url devnet  # Show program info
```

