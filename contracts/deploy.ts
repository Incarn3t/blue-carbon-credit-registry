#!/usr/bin/env tsx

import { readFileSync } from 'fs';
import { join } from 'path';

// Configuration
const NETWORK = process.env.STACKS_NETWORK || 'testnet';
const DEPLOYER_ADDRESS = process.env.STACKS_DEPLOYER_ADDRESS;

// Network configuration - Updated for StacksNet
const NETWORK_CONFIG = {
  testnet: {
    url: 'https://stacks-node-api.testnet.stacks.co',
    networkId: 2147483648,
    explorer: 'https://explorer.testnet.stacks.co'
  },
  mainnet: {
    url: 'https://stacks-node-api.mainnet.stacks.co',
    networkId: 1,
    explorer: 'https://explorer.stacks.co'
  }
};

console.log(`🚀 Blue Carbon Registry Contract Deployment Guide`);
console.log(`Network: ${NETWORK}`);
console.log(`Deployer: ${DEPLOYER_ADDRESS || 'Not set'}`);
console.log(`API: ${NETWORK_CONFIG[NETWORK as keyof typeof NETWORK_CONFIG].url}`);
console.log(`Explorer: ${NETWORK_CONFIG[NETWORK as keyof typeof NETWORK_CONFIG].explorer}\n`);

// Contract paths
const contracts = [
  {
    name: 'blue-carbon-registry',
    path: join(__dirname, 'blue-carbon-registry.clar'),
    description: 'Core project management and credit minting'
  },
  {
    name: 'blue-carbon-marketplace',
    path: join(__dirname, 'blue-carbon-marketplace.clar'),
    description: 'Trading platform for carbon credits'
  },
  {
    name: 'sensor-verification',
    path: join(__dirname, 'sensor-verification.clar'),
    description: 'IoT data and satellite imagery verification'
  }
];

function displayContractInfo(contract: typeof contracts[0]) {
  try {
    const contractSource = readFileSync(contract.path, 'utf8');
    console.log(`📄 ${contract.name}`);
    console.log(`   Description: ${contract.description}`);
    console.log(`   Source length: ${contractSource.length} characters`);
    console.log(`   Path: ${contract.path}`);
    console.log('');
  } catch (error) {
    console.error(`❌ Error reading ${contract.name}:`, error);
  }
}

function main() {
  console.log('📋 Contract Information:\n');
  
  contracts.forEach(displayContractInfo);
  
  console.log('🎯 Deployment Instructions for Leather Wallet + StacksNet:\n');
  console.log('1️⃣ Install Clarinet:');
  console.log('   curl -L https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-install.sh | bash\n');
  
  console.log('2️⃣ Initialize Clarinet Project:');
  console.log('   clarinet init blue-carbon-registry');
  console.log('   cd blue-carbon-registry\n');
  
  console.log('3️⃣ Copy Contracts:');
  console.log('   Copy the .clar files to the contracts/ directory\n');
  
  console.log('4️⃣ Deploy to Testnet:');
  console.log('   clarinet deploy --network testnet\n');
  
  console.log('5️⃣ Initialize Contracts:');
  console.log('   clarinet console --network testnet');
  console.log('   (contract-call? .blue-carbon-registry initialize)');
  console.log('   (contract-call? .blue-carbon-marketplace initialize-marketplace)');
  console.log('   (contract-call? .sensor-verification initialize-verification)\n');
  
  console.log('🔗 Useful Commands:');
  console.log('   npm run contracts:console:testnet  # Start Clarinet console');
  console.log('   npm run contracts:test             # Run local tests\n');
  
  console.log('📚 Documentation:');
  console.log('   - README.md: Full contract documentation');
  console.log('   - QUICKSTART.md: 10-minute setup guide');
  console.log('   - StacksNet Explorer: https://explorer.testnet.stacks.co');
}

main();
