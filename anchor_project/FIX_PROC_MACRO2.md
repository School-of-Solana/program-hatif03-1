# Fix for proc-macro2 SourceFile Error

## Problem
The error `cannot find type 'SourceFile' in crate 'proc_macro'` occurs because:
- `proc-macro2` v1.0.86 requires Rust 1.78.0+ (which has `SourceFile`)
- Your current Rust version (1.75.0) doesn't have `SourceFile` in `proc_macro`

## Solution

### Quick Fix (Run in WSL)

```bash
cd anchor_project

# Update to Rust 1.78.0 (has SourceFile support)
rustup install 1.78.0
rustup default 1.78.0

# Clean and rebuild
cargo clean
anchor build
```

### Or use the fix script:

```bash
cd anchor_project
chmod +x quick-fix.sh
bash quick-fix.sh
```

## What Changed

1. **Updated `rust-toolchain.toml`** - Changed from Rust 1.75.0 to 1.78.0
2. **The rust-toolchain.toml file** will automatically use Rust 1.78.0 when you run `anchor build`

## Why This Works

- Rust 1.78.0 introduced `proc_macro::SourceFile` 
- `proc-macro2` v1.0.86 uses this feature
- Anchor 0.30.1's IDL generation requires this version of proc-macro2

## Alternative (If 1.78.0 doesn't work)

Try the latest stable:

```bash
rustup update stable
rustup default stable
anchor build
```

