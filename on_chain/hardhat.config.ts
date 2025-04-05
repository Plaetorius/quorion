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
  solidity: "0.8.20",
  networks: {
    bahamut: {
      url: "https://rpc1.bahamut.io",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5165,
    },
  },
};

export default config;
