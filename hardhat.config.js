// We need to import these extensions in order for hardhat to function properly
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_RPC_URL,
      accounts: [`0x${process.env.WALLET_PRIVATE_KEY}`],
    },
  },

  // We don't need following ethescan block for deployment, but we need it for smart contract verification (upload).
  etherscan: {
    apiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
  },
};
