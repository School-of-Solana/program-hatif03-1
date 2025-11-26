# Fix Program ID Mismatch Error

## Problem
You're getting `DeclaredProgramIdMismatch` error (Error Code: 4100) when deploying. This happens when the program ID in your code doesn't match the program ID embedded in the compiled binary.

## Solution

The program ID in your `Anchor.toml` and `lib.rs` is: `8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee`

### Option 1: Use Anchor Keys Sync (Recommended)

Run this in your WSL terminal where Anchor is installed:

```bash
cd anchor_project
anchor keys sync
anchor build
anchor deploy
```

### Option 2: Manual Fix

If `anchor keys sync` doesn't work, follow these steps:

1. **Get the public key from your keypair:**
   ```bash
   cd anchor_project
   solana-keygen pubkey target/deploy/votee-keypair.json
   ```

2. **If the public key doesn't match `8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee`, you have two options:**

   **Option A: Update files to match keypair**
   - Note the public key from step 1
   - Update `Anchor.toml` line 12: `votee = "YOUR_KEYPAIR_PUBKEY"`
   - Update `programs/votee/src/lib.rs` line 13: `declare_id!("YOUR_KEYPAIR_PUBKEY");`

   **Option B: Generate new keypair matching the program ID**
   - Delete the old keypair: `rm target/deploy/votee-keypair.json`
   - Generate new keypair: `solana-keygen new --outfile target/deploy/votee-keypair.json --force --no-bip39-passphrase`
   - Get the new public key: `solana-keygen pubkey target/deploy/votee-keypair.json`
   - Update both `Anchor.toml` and `lib.rs` with the new public key

3. **Clean and rebuild:**
   ```bash
   rm -rf target/deploy/votee.so
   rm -rf target/idl/votee.json
   anchor build
   ```

4. **Deploy:**
   ```bash
   anchor deploy
   ```

### Option 3: Quick Fix Script

Run this script in WSL (make sure Anchor is in your PATH):

```bash
cd anchor_project
chmod +x fix-and-rebuild.sh
bash fix-and-rebuild.sh
```

## Why This Happens

The `DeclaredProgramIdMismatch` error occurs when:
- The program was built with one program ID
- But the code declares a different program ID
- Or the keypair's public key doesn't match the declared program ID

Anchor embeds the program ID from `declare_id!()` into the compiled binary. When deploying, Anchor checks that this embedded ID matches the keypair's public key.

## Verification

After fixing, verify the IDs match:
```bash
# Check Anchor.toml
grep -A 1 "\[programs.devnet\]" Anchor.toml

# Check lib.rs
grep "declare_id!" programs/votee/src/lib.rs

# Check keypair
solana-keygen pubkey target/deploy/votee-keypair.json
```

All three should show the same program ID.

