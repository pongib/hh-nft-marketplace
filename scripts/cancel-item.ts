import { mine } from "@nomicfoundation/hardhat-network-helpers"
import { ethers, network } from "hardhat"
import { NftMarketplace } from "../typechain-types"

const main = async () => {
  const tokenId = 1
  const nftMarketplace: NftMarketplace = await ethers.getContract(
    "NftMarketplace"
  )
  const basicNft = await ethers.getContract("BasicNft")
  const tx = await nftMarketplace.cancelListing(basicNft.address, tokenId)
  await tx.wait(1)
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
