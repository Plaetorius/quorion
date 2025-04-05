import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    bahamut: {
      url: "https://rpc1-horizon.bahamut.io",
      accounts: process.env.PRIVATE_KEY,
    },
  },
};

export default config;
