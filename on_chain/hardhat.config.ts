import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Ensure private key is available
if (!process.env.PRIVATE_KEY) {
  throw new Error("Please set your PRIVATE_KEY in a .env file");
}

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    bahamut: {
      url: "https://rpc1-horizon.bahamut.io",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 2552,
      // gasPrice: 2000000000000, // 2000 gwei
      // gasMultiplier: 1.2,
      // blockGasLimit: 30000000,
      // timeout: 60000,
    },
  },
};

export default config;
