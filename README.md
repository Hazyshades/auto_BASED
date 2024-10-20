# auto_BASED

This project automates the management of cryptocurrency wallets by processing them through a queue system, executing actions such as interacting with NFT minting, RubyScore operations, and deployment processes on the Ethereum blockchain.

## 📝 Features

- **Automated Wallet Management**: Manages multiple wallets using a queue system.
- **Dynamic Step Execution**: Randomly selects actions for each wallet, such as minting NFTs or performing RubyScore operations.
- **Gas Balance Check**: Ensures sufficient gas balance before performing actions.
- **Error Handling**: Catches errors and terminates the route for problematic wallets, preventing disruptions in the queue.

  In the Base network, you can:

1. **Customize NFT minting**: Adjust settings in `nfts2meClient.ts` for minting NFTs.
2. **Create contracts from scratch**: Use `deployClient.ts` to deploy new smart contracts.
3. **Interact with RubyScores contract**: Communicate directly with the RubyScores smart contract.
4. **Call the Dmail contract**: Utilize functions from the Dmail contract.
5. **Perform bridging**: Use bridge solutions like Nitro, Orbiter, and Owlto.
6. **Execute lending**: Engage in lending protocols like MoonWell and AAVE.
7. **Perform token swaps**: Swap tokens on platforms such as AlienSwap, BaseSwap, Bebop, 1inch, and Odos.

You can configure these options to tailor the automation process to your needs in the Base network.

The software supports AES encryption, ensuring that your data remains secure.

## 🚀 Prerequisites

- Node.js (v16+ recommended)
- NPM or Yarn package manager
- CSV file with wallet information

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/basefarm-wallet-automation.git](https://github.com/Hazyshades/auto_BASED)
   cd auto_BASED

2. Install dependencies:

    ```bash
    npm install
    
3. Prepare your wallets CSV file:
   Place the CSV file at ./src/data/wallets/baseFarm.csv containing wallet information.

## 💡 Usage
1. Start the wallet processing script:

    ```bash
    node src/index.js
2. Monitor the logs to see the status of each wallet as it progresses through its route.

## ⚙️ Configuration

Modify queueConfig in src/config to adjust the number of active wallets processed simultaneously.

Adjust the logic in getRoute and executeStep for custom routing and wallet actions.

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or new features.

## 📄 License

This project is licensed under the MIT License.

