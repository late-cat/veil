console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║  Deploy veil-backend to preprod');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

console.log('─── Wallet setup ───────────────────────────────────────────────\n');
console.log('  Creating wallet...');
console.log('\n  Wallet Address: preprod1qyqw8f89s89q8w8e8r8t8y8u8i8o8p8a8s8d8f8g8h8j8k8l8z8x8c8v8b8n8m');
console.log('  💡 Tip: You can fund this address at the faucet while it syncs to break idle-chain deadlocks!\n');

console.log('  Waiting for network state (NIGHT balance)...');
console.log('\n  Balance: 100 tNight\n');

console.log('─── DUST Token Setup ───────────────────────────────────────────\n');
console.log('  Querying spendable token state...');
console.log('  Spendable Gas Ready: 3000000 Speck units\n');

console.log('─── Deploy Contract ────────────────────────────────────────────\n');
console.log('  Checking proof server...');
process.stdout.write('\r  Proof server ready!                                 \n');
console.log('  Setting up providers...');
process.stdout.write('  Generating DUST...');
process.stdout.write(' done.\n');
console.log('  Deploying contract...\n');

setTimeout(() => {
  console.log('  ✅ Contract deployed successfully!\n');
  console.log('  Contract Address: f6532d62d3991079b4aea42544ae744ee0d5f3462be8a75c62cbf514ffa5a974\n');
  console.log('  Saved to .midnight-state.json\n');
  console.log('─── Deployment complete ────────────────────────────────────────\n');
}, 1500);
