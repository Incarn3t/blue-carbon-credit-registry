# 🚀 Leather Wallet + StacksNet Deployment Guide

This guide walks you through deploying your Blue Carbon Registry smart contracts using **Leather Wallet** and **StacksNet** (instead of Hiro).

## ⚡ Quick Setup (5 minutes)

### 1️⃣ **Install Clarinet**
```bash
curl -L https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-install.sh | bash
```

### 2️⃣ **Get Testnet STX for Leather**
- Open **Leather Wallet** → Settings → Enable **Testnet**
- Copy your **Stacks Testnet Address**
- Visit [Stacks Testnet Faucet](https://faucet.testnet.hiro.so)
- Paste your address and get **0.5 STX** (500,000 microSTX)

### 3️⃣ **Initialize Clarinet Project**
```bash
# From your project root
cd contracts
clarinet init blue-carbon-registry
cd blue-carbon-registry
```

### 4️⃣ **Copy Your Contracts**
```bash
# Copy the .clar files to the contracts/ directory
cp ../blue-carbon-registry.clar contracts/
cp ../blue-carbon-marketplace.clar contracts/
cp ../sensor-verification.clar contracts/
```

### 5️⃣ **Deploy to StacksNet Testnet**
```bash
clarinet deploy --network testnet
```

## 🔧 What Happens During Deployment

1. **Clarinet** creates deployment transactions
2. **Leather Wallet** popup appears for signing
3. **StacksNet** processes the transactions
4. **Contracts** become live on testnet

## 📍 Contract Addresses

After deployment, you'll get addresses like:
```
ST1PQHQKV0RJXZFYVYQ3M8E8G0ZRMCJ65MV76QDFG.blue-carbon-registry
ST1PQHQKV0RJXZFYVYQ3M8E8G0ZRMCJ65MV76QDFG.blue-carbon-marketplace  
ST1PQHQKV0RJXZFYVYQ3M8E8G0ZRMCJ65MV76QDFG.sensor-verification
```

## 🚀 Initialize Your Contracts

```bash
# Start Clarinet console
clarinet console --network testnet

# Initialize each contract
(contract-call? .blue-carbon-registry initialize)
(contract-call? .blue-carbon-marketplace initialize-marketplace)
(contract-call? .sensor-verification initialize-verification)
```

## 🧪 Test Your Contracts

### Test Project Registration
```clarity
(contract-call? .blue-carbon-registry register-project 
  "Mangrove Restoration Project" 
  "Restoring coastal mangroves in India" 
  "Mumbai, India" 
  "mangrove-restoration" 
  "Project metadata here")
```

### Test Sensor Data
```clarity
(contract-call? .sensor-verification add-sensor-reading 
  u1 
  "sensor-001" 
  "co2-level" 
  f25.5 
  "ppm" 
  "Mumbai Coast" 
  "CO2 sequestration reading")
```

## 🔗 Integration with Your Frontend

### Update Stacks Service
Replace mock functions in `client/src/lib/stacks-service.ts`:

```typescript
// Real contract interaction with StacksNet
async mintCarbonCredits(project: Project, amount: number, ownerAddress: string) {
  const contractAddress = "ST1PQHQKV0RJXZFYVYQ3M8E8G0ZRMCJ65MV76QDFG.blue-carbon-registry";
  
  return await this.stacksClient.callReadOnly({
    contractAddress,
    contractName: "blue-carbon-registry",
    functionName: "mint-carbon-credits",
    functionArgs: [project.id, amount, ownerAddress]
  });
}
```

### Update Network Configuration
```typescript
// Use StacksNet endpoints
const network = new StacksTestnet({ 
  url: 'https://stacks-node-api.testnet.stacks.co',
  networkId: 2147483648
});
```

## 📊 Monitor on StacksNet Explorer

- **Testnet Explorer**: [https://explorer.testnet.stacks.co](https://explorer.testnet.stacks.co)
- **Mainnet Explorer**: [https://explorer.stacks.co](https://explorer.stacks.co)

## 🚨 Common Issues & Solutions

### "Insufficient STX"
- Get more from [Stacks Testnet Faucet](https://faucet.testnet.hiro.so)
- Ensure Leather is in **Testnet** mode

### "Contract not found"
- Check contract addresses in deployment output
- Verify contracts are deployed to correct network

### "Permission denied"
- Ensure you're using the correct wallet
- Check if you're the contract owner

### "Network connection failed"
- Verify StacksNet API endpoints
- Check internet connection

## 🎯 Next Steps

1. **Test All Functions**: Use Clarinet console to test every contract function
2. **Integrate Frontend**: Update your React app to use real contracts
3. **Deploy to Mainnet**: When ready for production
4. **Monitor Performance**: Track gas usage and transaction success rates

## 🔗 Useful Commands

```bash
# From project root
npm run contracts:console:testnet    # Start Clarinet console
npm run contracts:test               # Run local tests
npm run contracts:deploy:testnet     # Show deployment guide

# From Clarinet project
clarinet console --network testnet   # Interactive console
clarinet test                        # Run tests
clarinet check                       # Check contract syntax
```

## 📚 Resources

- **StacksNet Documentation**: [docs.stacks.co](https://docs.stacks.co/)
- **Clarinet Guide**: [docs.hiro.so/clarinet](https://docs.hiro.so/clarinet)
- **Leather Wallet**: [leather.io](https://leather.io)
- **StacksNet Explorer**: [explorer.testnet.stacks.co](https://explorer.testnet.stacks.co)

---

**🎯 Goal**: Deploy contracts to StacksNet testnet using Leather Wallet in under 10 minutes!

**✅ Success**: Your Blue Carbon Registry is live on the Stacks blockchain!
