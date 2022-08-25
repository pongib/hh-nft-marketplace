import { mine } from "@nomicfoundation/hardhat-network-helpers"
import { ethers, network } from "hardhat"
import { NftMarketplace } from "../typechain-types"

const main = async () => {
  if (network.config.chainId == 31337) {
    console.log("Mined")
    await mine(2, { interval: 1 })
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
