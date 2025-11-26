# Fix for Rust Version Issue

## Problem
The build is failing with:
```
error[E0412]: cannot find type `SourceFile` in crate `proc_macro`
```

This happens because:
- Anchor 0.32.0 requires Rust 1.89.0+
- proc-macro2 1.0.86+ requires Rust 1.78+ for `SourceFile` support
- Your current Rust version is 1.85.0 (too old)

## Solution

The `rust-toolchain.toml` file has been updated to use Rust 1.89.0. 

### In WSL (where you're running the build):

1. **Update rustup and install the required toolchain:**
   ```bash
   rustup update
   rustup toolchain install 1.89.0
   rustup default 1.89.0
   ```

2. **Verify the Rust version:**
   ```bash
   rustc --version
   # Should show: rustc 1.89.0
   ```

3. **Clean and rebuild:**
   ```bash
   cd anchor_project
   cargo clean
   anchor build
   ```

The `rust-toolchain.toml` file will automatically use Rust 1.89.0 when building in this directory.

## Alternative: Use Latest Stable

If you prefer to use the latest stable Rust (which should be >= 1.89.0), you can change `rust-toolchain.toml` to:
```toml
[toolchain]
channel = "stable"
components = ["rustfmt", "clippy"]
profile = "default"
```

Then run:
```bash
rustup update stable
```

