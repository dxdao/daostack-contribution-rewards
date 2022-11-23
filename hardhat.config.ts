import '@nomicfoundation/hardhat-toolbox'
import { HardhatUserConfig } from 'hardhat/config'
import { HttpNetworkUserConfig } from 'hardhat/types'
import dotenv from 'dotenv'

// Import tasks
import './tasks/deploy'

// Load environment variables.
dotenv.config()
const {
  ALCHEMY_API_KEY,
  MNEMONIC,
  PRIVATE_KEY,
  ETHERSCAN_API_KEY,
} = process.env

const DEFAULT_MNEMONIC =
  'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'

const sharedNetworkConfig: HttpNetworkUserConfig = {}

if (PRIVATE_KEY) {
  sharedNetworkConfig.accounts = [PRIVATE_KEY]
} else {
  sharedNetworkConfig.accounts = {
    mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
  }
}
const config: HardhatUserConfig = {
  solidity: {
    version: '0.5.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    ethereum: {
      ...sharedNetworkConfig,
      url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      gas: 'auto',
      gasPrice: 'auto',
      chainId: 1,
    },
    goerli: {
      ...sharedNetworkConfig,
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      gas: 'auto',
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
}

export default config
