# Using a Different Wallet for Deployment

## Option 1: Use an Existing Wallet File

If you have another Solana wallet keypair file:

```bash
# Use a specific wallet file for deployment
anchor deploy --provider.cluster devnet --provider.wallet /path/to/your/wallet.json

# Or set it as the default temporarily
solana config set --keypair /path/to/your/wallet.json
anchor deploy --provider.cluster devnet
```

## Option 2: Create a New Wallet

```bash
# Create a new wallet
solana-keygen new -o ~/.config/solana/wallet2.json

# Check the address
solana address -k ~/.config/solana/wallet2.json

# Request airdrop for the new wallet
solana airdrop 2 --url devnet -k ~/.config/solana/wallet2.json

# Use this wallet for deployment
anchor deploy --provider.cluster devnet --provider.wallet ~/.config/solana/wallet2.json
```

## Option 3: Use Phantom or Other Browser Wallet

If you have Phantom or another browser wallet with devnet SOL:

1. **Export the private key from your browser wallet:**
   - In Phantom: Settings → Security & Privacy → Export Private Key
   - Save it securely

2. **Create a keypair file from the private key:**
   ```bash
   # The private key is a base58 string
   echo "YOUR_PRIVATE_KEY_BASE58" | solana-keygen new --no-bip39-passphrase --outfile ~/.config/solana/phantom-wallet.json
   ```

3. **Or use solana-keygen recover:**
   ```bash
   solana-keygen recover 'prompt://?full-path=/0/0' -o ~/.config/solana/phantom-wallet.json
   ```

4. **Use it for deployment:**
   ```bash
   anchor deploy --provider.cluster devnet --provider.wallet ~/.config/solana/phantom-wallet.json
   ```

## Option 4: Switch Default Wallet Temporarily

```bash
# Backup current wallet path
CURRENT_WALLET=$(solana config get | grep "Keypair Path" | awk '{print $3}')

# Switch to new wallet
solana config set --keypair ~/.config/solana/wallet2.json

# Deploy
anchor deploy --provider.cluster devnet

# Switch back if needed
solana config set --keypair "$CURRENT_WALLET"
```

## Quick Commands Reference

```bash
# List all your wallets
ls ~/.config/solana/*.json

# Check which wallet is currently set as default
solana config get

# Check balance of a specific wallet
solana balance --url devnet -k ~/.config/solana/wallet2.json

# Request airdrop for specific wallet
solana airdrop 2 --url devnet -k ~/.config/solana/wallet2.json
```

