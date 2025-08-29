# Blue Carbon Registry Smart Contracts

This directory contains the Clarity smart contracts for the Blue Carbon Registry on the Stacks blockchain.

## Overview

The Blue Carbon Registry is a comprehensive system for managing blue carbon projects, verifying environmental data, and trading carbon credits on the Stacks blockchain. The system consists of three main smart contracts:

1. **Blue Carbon Registry** - Core project management and credit minting
2. **Marketplace** - Trading platform for carbon credits
3. **Sensor Verification** - IoT data and satellite imagery verification

## Smart Contracts

### 1. Blue Carbon Registry (`blue-carbon-registry.clar`)

**Purpose**: Core contract for managing blue carbon projects and minting carbon credits.

**Key Functions**:
- `register-project` - Register new blue carbon projects
- `submit-verification` - Submit project for verification
- `approve-verification` - Approve or reject project verification
- `mint-carbon-credits` - Mint carbon credits for verified projects
- `transfer-credits` - Transfer credits between addresses
- `retire-credits` - Permanently retire credits

**Data Structures**:
- Projects: Project information and status
- Verifications: Verification data and results
- Carbon Credits: Credit ownership and status
- Events: Audit trail of all actions

### 2. Marketplace (`blue-carbon-marketplace.clar`)

**Purpose**: Enable trading of verified carbon credits.

**Key Functions**:
- `create-listing` - Create sell listings for credits
- `place-order` - Place buy orders for credits
- `confirm-order` - Confirm successful trades
- `cancel-listing` - Cancel active listings

**Features**:
- 0.25% marketplace fee
- 24-hour minimum listing duration
- 7-day maximum listing duration
- Order management system

### 3. Sensor Verification (`sensor-verification.clar`)

**Purpose**: Verify IoT sensor data and satellite imagery for projects.

**Key Functions**:
- `add-sensor-reading` - Add sensor data points
- `verify-sensor-data` - Verify data quality and consistency
- `verify-satellite-imagery` - Verify satellite data
- `approve-satellite-verification` - Approve satellite verification

**Verification Criteria**:
- 80% confidence threshold required
- Minimum 10 sensor readings
- 7-day data freshness limit
- Quality and consistency scoring

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Application                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    Stacks Service Layer                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │ Blue Carbon     │ │   Marketplace   │ │   Sensor        │ │
│  │ Registry        │ │                 │ │ Verification    │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    Stacks Blockchain                        │
│                    (Bitcoin Layer 2)                       │
└─────────────────────────────────────────────────────────────┘
```

## Deployment

### Prerequisites

1. **Install Clarinet** (Stacks development tool):
   ```bash
   curl -L https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-install.sh | bash
   ```

2. **Get Testnet STX**:
   - Visit [Hiro Testnet Faucet](https://faucet.testnet.hiro.so)
   - Authenticate with GitHub
   - Enter your wallet address
   - Receive 500,000 microSTX (0.5 STX)

3. **Set Environment Variables**:
   ```bash
   cp env.example .env
   # Edit .env with your values
   ```

### Deployment Steps

1. **Initialize Clarinet Project**:
   ```bash
   clarinet init blue-carbon-registry
   cd blue-carbon-registry
   ```

2. **Deploy Contracts**:
   ```bash
   # Deploy to testnet
   clarinet deploy --network testnet
   
   # Or use the TypeScript deployment script
   npm run deploy:testnet
   ```

3. **Initialize Contracts**:
   ```bash
   # Call initialize functions on each contract
   clarinet console --network testnet
   ```

### Contract Addresses

After deployment, you'll get contract addresses like:
- `ST1PQHQKV0RJXZFYVYQ3M8E8G0ZRMCJ65MV76QDFG.blue-carbon-registry`
- `ST1PQHQKV0RJXZFYVYQ3M8E8G0ZRMCJ65MV76QDFG.blue-carbon-marketplace`
- `ST1PQHQKV0RJXZFYVYQ3M8E8G0ZRMCJ65MV76QDFG.sensor-verification`

## Integration with Frontend

### Update Stacks Service

Replace mock implementations in `client/src/lib/stacks-service.ts`:

```typescript
// Real contract interaction
async mintCarbonCredits(project: Project, amount: number, ownerAddress: string) {
  const contractAddress = "ST1PQHQKV0RJXZFYVYQ3M8E8G0ZRMCJ65MV76QDFG.blue-carbon-registry";
  
  const result = await this.stacksClient.callReadOnly({
    contractAddress,
    contractName: "blue-carbon-registry",
    functionName: "mint-carbon-credits",
    functionArgs: [project.id, amount, ownerAddress]
  });
  
  return result;
}
```

### Contract Function Mapping

| Frontend Action | Contract Function | Contract |
|----------------|------------------|----------|
| Register Project | `register-project` | Blue Carbon Registry |
| Submit Verification | `submit-verification` | Blue Carbon Registry |
| Mint Credits | `mint-carbon-credits` | Blue Carbon Registry |
| List Credits | `create-listing` | Marketplace |
| Buy Credits | `place-order` | Marketplace |
| Add Sensor Data | `add-sensor-reading` | Sensor Verification |

## Testing

### Local Testing

```bash
# Run Clarinet tests
clarinet test

# Start local network
clarinet console
```

### Testnet Testing

```bash
# Deploy to testnet
clarinet deploy --network testnet

# Interact with contracts
clarinet console --network testnet
```

## Security Features

- **Access Control**: Only authorized users can perform specific actions
- **Data Validation**: Comprehensive input validation and error handling
- **Event Logging**: Complete audit trail of all blockchain actions
- **Emergency Pause**: Contract owner can pause operations if needed
- **Verification Thresholds**: Configurable verification requirements

## Gas Optimization

- **Efficient Data Structures**: Optimized for minimal gas consumption
- **Batch Operations**: Support for multiple operations in single transaction
- **Read-Only Functions**: Separate read functions for gas-free queries
- **Event Optimization**: Efficient event storage and retrieval

## Monitoring and Analytics

### Key Metrics

- Total projects registered
- Verification success rates
- Credits minted and traded
- Marketplace activity
- Sensor data quality scores

### Event Tracking

All major actions emit events for monitoring:
- Project registration
- Verification submissions
- Credit minting
- Marketplace trades
- Sensor data updates

## Future Enhancements

- **Multi-signature Support**: Enhanced security for large operations
- **Cross-chain Integration**: Support for other blockchains
- **Advanced Analytics**: Machine learning for verification
- **Automated Verification**: AI-powered data validation
- **Carbon Credit Standards**: Integration with international standards

## Support and Resources

- **Stacks Documentation**: [docs.stacks.co](https://docs.stacks.co/)
- **Clarinet Guide**: [docs.hiro.so/clarinet](https://docs.hiro.so/clarinet)
- **Stacks Discord**: [discord.gg/stacks](https://discord.gg/stacks)
- **Hiro Developer Hub**: [hiro.so/developers](https://hiro.so/developers)

## License

MIT License - see LICENSE file for details.
