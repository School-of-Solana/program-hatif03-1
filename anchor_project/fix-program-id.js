const fs = require('fs');
const path = require('path');
const { Keypair } = require('@solana/web3.js');

// Read the keypair file
const keypairPath = path.join(__dirname, 'target', 'deploy', 'votee-keypair.json');
const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));

// Convert array to Uint8Array
const secretKey = new Uint8Array(keypairData);
const keypair = Keypair.fromSecretKey(secretKey);
const publicKey = keypair.publicKey.toBase58();

console.log('🔑 Keypair Public Key:', publicKey);

// Read Anchor.toml
const anchorTomlPath = path.join(__dirname, 'Anchor.toml');
let anchorToml = fs.readFileSync(anchorTomlPath, 'utf8');

// Update program ID in Anchor.toml for devnet
const devnetMatch = anchorToml.match(/\[programs\.devnet\]\s*votee = "([^"]+)"/);
if (devnetMatch) {
    const oldId = devnetMatch[1];
    if (oldId !== publicKey) {
        console.log(`📝 Updating Anchor.toml: ${oldId} -> ${publicKey}`);
        anchorToml = anchorToml.replace(
            /(\[programs\.devnet\]\s*votee = ")[^"]+(")/,
            `$1${publicKey}$2`
        );
        fs.writeFileSync(anchorTomlPath, anchorToml);
        console.log('✅ Updated Anchor.toml');
    } else {
        console.log('✅ Anchor.toml already matches keypair');
    }
}

// Read lib.rs
const libRsPath = path.join(__dirname, 'programs', 'votee', 'src', 'lib.rs');
let libRs = fs.readFileSync(libRsPath, 'utf8');

// Update program ID in lib.rs
const declareIdMatch = libRs.match(/declare_id!\("([^"]+)"\)/);
if (declareIdMatch) {
    const oldId = declareIdMatch[1];
    if (oldId !== publicKey) {
        console.log(`📝 Updating lib.rs: ${oldId} -> ${publicKey}`);
        libRs = libRs.replace(
            /(declare_id!\(")[^"]+("\))/,
            `$1${publicKey}$2`
        );
        fs.writeFileSync(libRsPath, libRs);
        console.log('✅ Updated lib.rs');
    } else {
        console.log('✅ lib.rs already matches keypair');
    }
}

console.log('\n✅ Program ID sync complete!');
console.log('🔨 Next steps:');
console.log('   1. Run: anchor build');
console.log('   2. Run: anchor deploy');

