import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
};

module.exports = {
  defaultNetwork: "bahamut",

  networks: {
    sahara: {
      url: "rpc1-horizon.bahamut.io",

      accounts: [process.env.PRIVATE_KEY],
    },
  },
};

export default config;
