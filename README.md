

# Robot Marketplace

**Robot Marketplace** is a decentralized platform where users can trade robots or related items, initiate crowdfunding campaigns, and experience a clean, minimal UI. Powered by smart contracts written in Solidity, this marketplace ensures secure, transparent, and trustless transactions.


## Features

* Marketplace: Buy, sell, and trade robots or related assets with ease.
* Crowdfunding: Creators can activate crowdfunding campaigns for their robotics projects.
* Smart Contracts: Core functionalities powered by Solidity contracts deployed on the blockchain.
* Clean UI: Minimal, modern, and responsive user interface for a seamless experience.
* Secure & Transparent: All transactions are immutable and verifiable on-chain.


## Tech Stack

* Frontend: React / Next.js (or specify your frontend framework)
* Blockchain: Solidity, Hardhat / Foundry
* Wallet Integration: MetaMask / WalletConnect
* Storage: IPFS / Pinata (optional for assets or metadata)
* Backend: Node.js / Express (if applicable)


## Getting Started

### Prerequisites

* Node.js >= 18
* MetaMask extension
* Hardhat / Foundry installed globally

### Installation

```bash
git clone https://github.com/yourusername/robot-marketplace.git
cd robot-marketplace
npm install
```

### Running Locally

```bash
# Start the smart contract dev environment
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Start the frontend
npm run dev
```


## Contracts

Smart contracts are located in the `contracts/` folder.

* `Marketplace.sol`: Handles listing, buying, and selling robots.
* `CrowdfundFactory.sol`: Allows users to create and manage crowdfunding campaigns.
* `RobotNFT.sol`: (Optional) NFT contract for tokenizing robots.

---

## Screenshots of the website
<img width="1440" alt="Screenshot 2025-07-02 at 10 59 54 AM" src="https://github.com/user-attachments/assets/6bc0dd67-4744-4582-b114-6ba2fe0d6da4" />
<img width="1440" alt="Screenshot 2025-07-02 at 11 00 02 AM" src="https://github.com/user-attachments/assets/b419ff5c-f6af-40b1-8f48-172f8580866a" />
<img width="1440" alt="Screenshot 2025-07-02 at 11 00 25 AM" src="https://github.com/user-attachments/assets/57bb3699-0715-48dd-bebe-79c63f0166bc" />
<img width="1440" alt="Screenshot 2025-07-02 at 11 00 51 AM" src="https://github.com/user-attachments/assets/6954eef7-c343-4611-98ae-68ecf9d2d839" />
<img width="1440" alt="Screenshot 2025-07-02 at 11 01 08 AM" src="https://github.com/user-attachments/assets/7301c6b4-c6e6-4fd7-95f7-db3d8439200e" />

