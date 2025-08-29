# 🚀 Quick Start Guide - Blue Carbon Registry Smart Contracts

Get your Blue Carbon Registry smart contracts up and running in 10 minutes!

## ⚡ Quick Setup

### 1. Install Clarinet
```bash
curl -L https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-install.sh | bash
```

### 2. Get Testnet STX
- Go to [Hiro Testnet Faucet](https://faucet.testnet.hiro.so)
- Sign in with GitHub
- Enter your wallet address
- Get 0.5 STX for free

### 3. Set Environment Variables
```bash
cd contracts
cp env.example .env
# Edit .env with your wallet details
```

### 4. Deploy to Testnet
```bash
# From project root
npm run contracts:deploy:testnet

# Or manually
cd contracts
tsx deploy.ts
```

### 5. Initialize Contracts
```bash
npm run contracts:console:testnet
```

## 🔧 What You Get

✅ **3 Smart Contracts Deployed**
- Blue Carbon Registry (core functionality)
- Marketplace (trading platform)
- Sensor Verification (data validation)

✅ **Complete Carbon Credit Lifecycle**
- Project registration
- Data verification
- Credit minting
- Trading & retirement

✅ **Production-Ready Features**
- Access control
- Event logging
- Error handling
- Gas optimization

## 📱 Frontend Integration

Update your `stacks-service.ts`:

```typescript
// Replace mock functions with real contract calls
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

## 🧪 Testing

### Local Testing
```bash
npm run contracts:test
npm run contracts:console
```

### Testnet Testing
```bash
npm run contracts:console:testnet
```

## 📊 Contract Functions

| Action | Function | Contract |
|--------|----------|----------|
| Register Project | `register-project` | Registry |
| Submit Data | `submit-verification` | Registry |
| Mint Credits | `mint-carbon-credits` | Registry |
| List for Sale | `create-listing` | Marketplace |
| Buy Credits | `place-order` | Marketplace |
| Add Sensor Data | `add-sensor-reading` | Verification |

## 🚨 Common Issues

**"Insufficient STX"**
- Get more from [testnet faucet](https://faucet.testnet.hiro.so)

**"Contract not found"**
- Check contract addresses in deployment output
- Ensure contracts are deployed to correct network

**"Permission denied"**
- Verify you're using the correct wallet
- Check if you're the contract owner

## 📚 Next Steps

1. **Read the full documentation**: `README.md`
2. **Explore contract code**: `.clar` files
3. **Test all functions**: Use Clarinet console
4. **Integrate with frontend**: Update service layer
5. **Deploy to mainnet**: When ready for production

## 🆘 Need Help?

- **Documentation**: `README.md`
- **Stacks Docs**: [docs.stacks.co](https://docs.stacks.co/)
- **Clarinet Guide**: [docs.hiro.so/clarinet](https://docs.hiro.so/clarinet)
- **Community**: [discord.gg/stacks](https://discord.gg/stacks)

---

**🎯 Goal**: Get from 0 to deployed smart contracts in under 10 minutes!

**✅ Success**: You can register projects, mint credits, and trade them on Stacks blockchain!
