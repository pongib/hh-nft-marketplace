import { ethers } from "hardhat"

export interface networkConfigItem {
  ethUsdPriceFeed?: string
  blockConfirmation?: number
  chainId?: number
  name?: string
  subscriptionId?: string
  gasLane?: string
  keepersUpdateInterval?: string
  raffleEntranceFee?: string
  callbackGasLimit?: string
  vrfCoordinatorV2?: string
  verifyBlockNumber?: number
  fundAmount?: string
  waitBlockConfirmations?: number
  ethPriceFeedAddress?: string
}

export interface networkConfigInfo {
  [key: number]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
  31337: {
    chainId: 31337,
    name: "localhost",
    subscriptionId: "1",
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
    keepersUpdateInterval: "30",
    raffleEntranceFee: "100000000000000000", // 0.1 ETH
    callbackGasLimit: "500000", // 500,000 gas
    fundAmount: "1000000000000000000000",
    waitBlockConfirmations: 1,
  },
  4: {
    ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    blockConfirmation: 6,
    chainId: 4,
    name: "rinkeby",
    subscriptionId: "10660",
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
    keepersUpdateInterval: "30",
    raffleEntranceFee: "100000000000000000", // 0.1 ETH
    callbackGasLimit: "500000", // 500,000 gas
    vrfCoordinatorV2: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
    verifyBlockNumber: 6,
    waitBlockConfirmations: 6,
    ethPriceFeedAddress: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
  },
}

export const developmentChainId = [31337]

export const DECIMALS = "18"
export const INITIAL_PRICE = "200000000000000000000"

export const frontEndAbiFile = "../next-lottery/constants/abi.json"

export const frontEndContractsFile =
  "../nft-marketplace-moralis/constants/networkMapping.json"
export const frontEndContractsFile2 =
  "../nft-marketplace-thegraph/constants/networkMapping.json"
export const frontEndAbiLocation = "../nft-marketplace-moralis/constants/"
export const frontEndAbiLocation2 = "../nft-marketplace-thegraph/constants/"
