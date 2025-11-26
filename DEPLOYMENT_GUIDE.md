# Deployment Guide for Votee dApp

This guide will walk you through deploying both the Solana program and the frontend application.

## Prerequisites

1. **Solana CLI** installed and configured
   ```bash
   # Check if Solana CLI is installed
   solana --version
   
   # If not installed, follow: https://docs.solana.com/cli/install-solana-cli-tools
   ```

2. **Anchor CLI** installed
   ```bash
   # Check if Anchor is installed
   anchor --version
   
   # If not installed, follow: https://www.anchor-lang.com/docs/installation
   ```

3. **Node.js and npm/yarn** installed
   ```bash
   node --version
   npm --version
   ```

4. **Solana wallet** with Devnet SOL
   ```bash
   # Set Solana CLI to Devnet
   solana config set --url devnet
   
   # Check your wallet address
   solana address
   
   # Request airdrop (if needed)
   solana airdrop 2
   ```

5. **Vercel account** (or another hosting provider) for frontend deployment

---

## Part 1: Deploy the Solana Program to Devnet

### Step 1: Navigate to Anchor Project

```bash
cd anchor_project
```

### Step 2: Build the Program

```bash
# Build the program
anchor build
```

This will:
- Compile your Rust program
- Generate the IDL (Interface Definition Language) file
- Generate TypeScript types
- Create the program binary

### Step 3: Update Anchor.toml for Devnet

The `Anchor.toml` file should already have devnet configuration, but verify it:

```toml
[provider]
cluster = "devnet"  # Make sure this is set to devnet
wallet = "~/.config/solana/id.json"

[programs.devnet]
votee = "8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee"  # Deployed program ID
```

### Step 4: Deploy to Devnet

```bash
# Deploy the program
anchor deploy --provider.cluster devnet
```

**Important Notes:**
- This will deploy your program and output a new program ID
- **Copy the program ID** that gets printed - you'll need it in the next steps
- The deployment may take a few minutes
- Make sure you have enough SOL in your wallet (usually 2-3 SOL is enough)

### Step 5: Update Program ID (Already Completed)

The program has been deployed with the following ID: `8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee`

The program ID is already configured in:
- `anchor_project/programs/votee/src/lib.rs`: `declare_id!("8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee");`
- `anchor_project/Anchor.toml`: `votee = "8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee"`

**If you need to redeploy or upgrade:**
```bash
anchor build
anchor deploy --provider.cluster devnet
```

### Step 6: Verify Deployment

The program has been successfully deployed! You can verify it on Solana Explorer:

- **Program**: https://explorer.solana.com/address/8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee?cluster=devnet
- **Deployment Transaction**: https://explorer.solana.com/tx/4S2GDJcc4MT8Sc9piGrYYRnPYe5ZuMhzo4gxwi2bbNMSciJiQZy13QQfXPonmsHKUkPCQq3G1gAMsksaQcuTjEQ8?cluster=devnet
- **IDL Account**: `AEXVu8NQJaSrMVnScc4rgVuDYfnYDNV2utfBMavbuxib`

```bash
# Check program info via CLI
solana program show 8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee --url devnet
```

---

## Part 2: Update Frontend Configuration

### Step 1: Copy Generated Files

After building the Anchor program, you need to ensure the frontend can access the IDL and types:

```bash
# The IDL and types are already in anchor_project/target/
# The frontend is already configured to reference them at:
# frontend/src/app/services/blockchain.service.tsx
```

The frontend should already be configured to read from `../../../../anchor_project/target/`.

### Step 2: Create Environment File

Create a `.env.local` file in the `frontend` directory:

```bash
cd frontend
```

Create `.env.local`:
```env
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=YOUR_PROGRAM_ID_HERE
```

**For better performance, consider using a custom RPC endpoint:**
- [Helius](https://www.helius.dev/) - Free tier available
- [QuickNode](https://www.quicknode.com/) - Free tier available
- [Alchemy](https://www.alchemy.com/) - Free tier available

Example with custom RPC:
```env
NEXT_PUBLIC_RPC_URL=https://your-custom-rpc-url.com
```

**Note:** The program ID is automatically read from the IDL file, so you don't need to set `NEXT_PUBLIC_PROGRAM_ID` unless you want to override it.

### Step 3: Update Frontend Service (if needed)

Check that `frontend/src/app/services/blockchain.service.tsx` correctly reads the program ID:

```typescript
// It should read from the IDL:
const programId = new PublicKey(idl.address)
```

If you need to override it, you can modify it to:
```typescript
const programId = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID || idl.address
)
```

---

## Part 3: Deploy the Frontend

### Option A: Deploy to Vercel (Recommended)

1. **Install Vercel CLI** (optional, you can also use the web interface):
   ```bash
   npm i -g vercel
   ```

2. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

3. **Deploy to Vercel:**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No** (for first deployment)
   - Project name? (Press Enter for default or enter a name)
   - Directory? **./** (current directory)
   - Override settings? **No**

4. **Add Environment Variables in Vercel Dashboard:**
   - Go to your project on [vercel.com](https://vercel.com)
   - Navigate to Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_RPC_URL` = `https://api.devnet.solana.com` (or your custom RPC)
     - (Optional) `NEXT_PUBLIC_PROGRAM_ID` = `8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee` (usually not needed as it's read from IDL)

5. **Redeploy:**
   - Go to Deployments tab
   - Click the three dots on the latest deployment
   - Click "Redeploy"

### Option B: Deploy to Netlify

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

5. **Add Environment Variables:**
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Add the same variables as above

### Option C: Deploy to Other Providers

For other providers (Railway, Render, etc.), follow their specific deployment instructions. The key is to:
1. Set environment variables
2. Build the Next.js app
3. Deploy the `.next` build output

---

## Part 4: Initialize the Program

After deployment, you need to initialize the program on-chain:

### Option 1: Using Anchor CLI

```bash
cd anchor_project

# Switch to devnet
solana config set --url devnet

# Run the initialize instruction
anchor run initialize --provider.cluster devnet
```

### Option 2: Using the Frontend

1. Visit your deployed frontend
2. Connect your wallet
3. The first time you use the app, you may need to initialize (if the program requires it)

### Option 3: Create a Script

Create a file `anchor_project/scripts/initialize.ts`:

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Votee } from "../target/types/votee";
import { PublicKey, SystemProgram } from "@solana/web3.js";

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Votee as Program<Votee>;

  const [counterPda] = await PublicKey.findProgramAddress(
    [Buffer.from("counter")],
    program.programId
  );

  const [registerationsPda] = await PublicKey.findProgramAddress(
    [Buffer.from("registerations")],
    program.programId
  );

  try {
    await program.rpc.initialize({
      accounts: {
        user: provider.wallet.publicKey,
        counter: counterPda,
        registerations: registerationsPda,
        systemProgram: SystemProgram.programId,
      },
    });
    console.log("Program initialized successfully!");
  } catch (err) {
    console.error("Error initializing:", err);
  }
}

main();
```

Run it:
```bash
anchor run initialize
```

---

## Part 5: Testing the Deployment

### Test the Program

```bash
cd anchor_project
anchor test --skip-local-validator --provider.cluster devnet
```

### Test the Frontend

1. Visit your deployed frontend URL
2. Connect your wallet (make sure it's set to Devnet)
3. Try creating a poll
4. Register a candidate
5. Cast a vote

---

## Troubleshooting

### Program Deployment Issues

**Error: "Insufficient funds"**
```bash
# Request more SOL
solana airdrop 2
```

**Error: "Program already deployed"**
- This means the program ID is already in use
- Generate a new keypair for the program:
  ```bash
  solana-keygen new -o target/deploy/votee-keypair.json
  ```
- Update the program ID in `lib.rs` and `Anchor.toml`
- Rebuild and redeploy

### Frontend Issues

**Error: "Cannot find module"**
- Make sure you've built the Anchor program first: `cd anchor_project && anchor build`
- Verify the paths in `blockchain.service.tsx` are correct

**Error: "Invalid program ID"**
- Check that `NEXT_PUBLIC_PROGRAM_ID` matches your deployed program ID
- Verify the IDL file has the correct address

**RPC Rate Limiting**
- Use a custom RPC endpoint (Helius, QuickNode, etc.)
- Update `NEXT_PUBLIC_RPC_URL` in your environment variables

---

## Final Checklist

Before submitting:

- [x] Program deployed to Devnet
- [x] Program ID updated in `lib.rs` and `Anchor.toml` (8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee)
- [x] Frontend IDL updated with deployed program ID
- [x] Frontend deployed and accessible (https://votee-smoky.vercel.app/)
- [ ] Program initialized on-chain (can be done via frontend)
- [ ] Can create polls from frontend
- [ ] Can register candidates from frontend
- [ ] Can vote from frontend
- [x] `PROJECT_DESCRIPTION.md` updated with:
  - [x] Deployed Frontend URL
  - [x] Solana Program ID
  - [x] Deployment signature and IDL account

---

## Useful Commands Reference

```bash
# Anchor commands
anchor build                    # Build the program
anchor deploy                    # Deploy to configured cluster
anchor deploy --provider.cluster devnet  # Deploy to devnet
anchor test                      # Run tests
anchor test --skip-local-validator --provider.cluster devnet  # Test on devnet

# Solana commands
solana config set --url devnet  # Switch to devnet
solana address                   # Show wallet address
solana balance                   # Check SOL balance
solana airdrop 2                 # Request 2 SOL airdrop
solana program show <PROGRAM_ID> # Show program info

# Frontend commands
cd frontend
npm install                     # Install dependencies
npm run build                   # Build for production
npm run dev                     # Run development server
```

---

## Support

If you encounter issues:
1. Check the Solana Explorer for your program: `https://explorer.solana.com/address/YOUR_PROGRAM_ID?cluster=devnet`
2. Check transaction logs in your wallet
3. Review the browser console for frontend errors
4. Check Vercel/Netlify deployment logs

Good luck with your deployment! 🚀

