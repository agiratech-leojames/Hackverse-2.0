require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

const {AMECHAIN_MAIN, AME_MUMBAI, AME, AMECHAIN_TEST, DEPLOYER_PVT_AD, L1PVT, L2PVT, BUYER, ES_API, ES_API_POLYSCAN, P_MAINNET, P_MUMBAI, GOERLI} = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers :[
    {
      version : "0.5.16"
    },
    {
      version : "0.8.0"
    },
    {
      version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
    },
  ],
  },
  networks:{
    amechain: {
      url: AMECHAIN_MAIN,  
      accounts: [AME_MUMBAI, DEPLOYER_PVT_AD, L1PVT, L2PVT, BUYER],
      gas: 2100000,
      gasPrice: 8000000000,
      gasLimit : 21000
    },
    ameChain_testnet: {
      url:AMECHAIN_TEST,  
      accounts: [AME_MUMBAI,DEPLOYER_PVT_AD, L1PVT, L2PVT, BUYER],
      gas: 2100000,
      gasPrice: 8000000000,
      gasLimit : 21000
    },
    mumbai: {
      url:P_MUMBAI,   
      accounts: [AME_MUMBAI, DEPLOYER_PVT_AD, L1PVT, L2PVT, BUYER],
      gas: 2100000,
      gasPrice: 8000000000,
    },
    goerli: {
      url:GOERLI,  
      accounts: [AME_MUMBAI, DEPLOYER_PVT_AD],
      gas: 2100000,
      gasPrice: 8000000000
    }
  },
  etherscan : {
    apiKey : {
      polygonMumbai:ES_API_POLYSCAN,
      goerli:ES_API,
      ameChain: "https://mainnet.amescan.io/api/eth-rpc"
    },
    customChains: [
    {
      network: "ameChain",
      chainId: 180,
      urls: {
        apiURL: "https://mainnet.amescan.io/api/eth-rpc",
        browserURL: "https://node1.amechain.io/"
      }
    }
  ]
},
  mocha: {
    timeout: 160000
  }
};