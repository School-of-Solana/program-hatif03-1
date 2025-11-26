#!/usr/bin/env python3
"""
Fix Program ID Mismatch by syncing the program ID from keypair to Anchor.toml and lib.rs
"""

import json
import re
import sys
from pathlib import Path

try:
    from nacl.signing import SigningKey
    from base58 import b58encode
except ImportError:
    print("Installing required packages...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pynacl", "base58"])
    from nacl.signing import SigningKey
    from base58 import b58encode

def get_public_key_from_keypair(keypair_path):
    """Extract public key from Solana keypair JSON file"""
    with open(keypair_path, 'r') as f:
        secret_key = json.load(f)
    
    # Convert to bytes
    secret_key_bytes = bytes(secret_key)
    
    # Create signing key from secret
    signing_key = SigningKey(secret_key_bytes[:32])
    
    # Get public key (first 32 bytes of the secret key in Solana)
    # Actually, in Solana, the keypair format is [secret_key (32 bytes), public_key (32 bytes)]
    # But for nacl, we use the secret key to derive the public key
    verify_key = signing_key.verify_key
    
    # Solana uses the first 32 bytes as seed, then derives public key
    # For nacl, the verify_key.encode() gives us the public key bytes
    public_key_bytes = verify_key.encode()
    
    # Base58 encode
    public_key = b58encode(public_key_bytes).decode('utf-8')
    
    return public_key

def update_anchor_toml(anchor_toml_path, new_program_id):
    """Update program ID in Anchor.toml"""
    with open(anchor_toml_path, 'r') as f:
        content = f.read()
    
    # Find and replace devnet program ID
    pattern = r'(\[programs\.devnet\]\s*votee = ")[^"]+(")'
    replacement = f'\\g<1>{new_program_id}\\g<2>'
    new_content = re.sub(pattern, replacement, content)
    
    if new_content != content:
        with open(anchor_toml_path, 'w') as f:
            f.write(new_content)
        return True
    return False

def update_lib_rs(lib_rs_path, new_program_id):
    """Update program ID in lib.rs"""
    with open(lib_rs_path, 'r') as f:
        content = f.read()
    
    # Find and replace declare_id!
    pattern = r'(declare_id!\(")[^"]+("\))'
    replacement = f'\\g<1>{new_program_id}\\g<2>'
    new_content = re.sub(pattern, replacement, content)
    
    if new_content != content:
        with open(lib_rs_path, 'w') as f:
            f.write(new_content)
        return True
    return False

def main():
    script_dir = Path(__file__).parent
    keypair_path = script_dir / 'target' / 'deploy' / 'votee-keypair.json'
    anchor_toml_path = script_dir / 'Anchor.toml'
    lib_rs_path = script_dir / 'programs' / 'votee' / 'src' / 'lib.rs'
    
    if not keypair_path.exists():
        print(f"❌ Keypair file not found: {keypair_path}")
        sys.exit(1)
    
    print("🔑 Reading keypair...")
    try:
        public_key = get_public_key_from_keypair(keypair_path)
        print(f"✅ Keypair public key: {public_key}")
    except Exception as e:
        print(f"❌ Error reading keypair: {e}")
        print("\n💡 Alternative: Use solana-keygen to get the public key:")
        print(f"   solana-keygen pubkey {keypair_path}")
        sys.exit(1)
    
    # Read current program IDs
    with open(anchor_toml_path, 'r') as f:
        anchor_content = f.read()
    anchor_match = re.search(r'\[programs\.devnet\]\s*votee = "([^"]+)"', anchor_content)
    anchor_program_id = anchor_match.group(1) if anchor_match else None
    
    with open(lib_rs_path, 'r') as f:
        lib_content = f.read()
    lib_match = re.search(r'declare_id!\("([^"]+)"\)', lib_content)
    lib_program_id = lib_match.group(1) if lib_match else None
    
    print(f"\n📋 Current Program IDs:")
    print(f"   Anchor.toml: {anchor_program_id}")
    print(f"   lib.rs: {lib_program_id}")
    print(f"   Keypair: {public_key}")
    
    # Check if they all match
    if anchor_program_id == lib_program_id == public_key:
        print("\n✅ All program IDs already match!")
        return
    
    # Update files to match keypair
    print(f"\n🔄 Updating files to match keypair public key...")
    
    updated_anchor = update_anchor_toml(anchor_toml_path, public_key)
    updated_lib = update_lib_rs(lib_rs_path, public_key)
    
    if updated_anchor:
        print(f"✅ Updated Anchor.toml")
    if updated_lib:
        print(f"✅ Updated lib.rs")
    
    if not updated_anchor and not updated_lib:
        print("⚠️  No files needed updating")
    
    print(f"\n✅ Program ID sync complete!")
    print(f"🔨 Next steps:")
    print(f"   1. Run: anchor build")
    print(f"   2. Run: anchor deploy")

if __name__ == '__main__':
    main()

