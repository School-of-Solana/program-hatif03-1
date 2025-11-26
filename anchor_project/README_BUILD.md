# How to Fix and Build

## Quick Fix (Copy & Paste in WSL)

```bash
cd /mnt/c/Users/mdhat/Desktop/program-hatif03-1/anchor_project

# Update Rust to latest stable (has SourceFile support)
rustup update stable
rustup default stable

# Clean everything
cargo clean
rm -rf target/ .anchor/idl/

# Build
anchor build
```

## Or Use the Script

```bash
cd anchor_project
chmod +x RUN_THIS.sh
bash RUN_THIS.sh
```

## What's the Problem?

- `proc-macro2` v1.0.86 needs Rust 1.78.0+ (for `SourceFile`)
- Your current Rust version is older
- Solution: Update Rust to latest stable

## After Building

Once build succeeds, you can:
- Deploy: `anchor deploy --provider.cluster devnet`
- Test: `anchor test`
- Check program: `solana program show <PROGRAM_ID>`

