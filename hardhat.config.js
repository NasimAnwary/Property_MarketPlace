require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://localhost:7545", // Replace with your Ganache RPC endpoint
    },
  },
  // ... other configurations
};

