# Fixing Anchor Build Errors

## Problem
The build is failing with `proc-macro2` compilation errors due to Rust toolchain version incompatibility.

## Solution

### Option 1: Quick Fix (Recommended)

Run this in your WSL terminal:

```bash
cd anchor_project

# Update Rust toolchain
rustup update stable
rustup default stable

# Install required components
rustup component add rust-src
rustup target add bpf-unknown-unknown

# Clean and rebuild
cargo clean
anchor build
```

### Option 2: Use the Fix Script

```bash
cd anchor_project
chmod +x fix-build.sh
bash fix-build.sh
```

### Option 3: Manual Steps

1. **Check Rust version:**
   ```bash
   rustc --version
   ```
   Should be 1.75.0 or later for Anchor 0.30.1

2. **Update Rust if needed:**
   ```bash
   rustup update stable
   rustup default stable
   ```

3. **Install Solana CLI and BPF toolchain:**
   ```bash
   sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
   export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
   ```

4. **Clean and rebuild:**
   ```bash
   cd anchor_project
   cargo clean
   rm -rf target/
   anchor build
   ```

### If Still Failing

Try using a specific Rust version:

```bash
rustup install 1.75.0
rustup default 1.75.0
anchor build
```

Or update to the latest stable:

```bash
rustup update stable
rustup default stable
anchor build
```

## Common Issues

### "proc-macro2 compilation errors"
- **Cause:** Rust version too old or too new
- **Fix:** Use Rust 1.75.0 - 1.78.0 range

### "Stack offset exceeded"
- **Cause:** Compiler optimization issue
- **Fix:** Clean build and try again: `cargo clean && anchor build`

### "BPF toolchain not found"
- **Cause:** Solana CLI not installed or not in PATH
- **Fix:** Install Solana CLI and add to PATH

