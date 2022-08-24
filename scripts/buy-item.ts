import { mine } from "@nomicfoundation/hardhat-network-helpers"
import { ethers, network } from "hardhat"
import { NftMarketplace } from "../typechain-types"

const main = async () => {
  const tokenId = 3
  const nftMarketplace: NftMarketplace = await ethers.getContract(
    "NftMarketplace"
  )
  const basicNft = await ethers.getContract("BasicNft")
  // get price from listing nft
  const listing = await nftMarketplace.getListing(basicNft.address, tokenId)
  const tx = await nftMarketplace.buyItem(basicNft.address, tokenId, {
    value: listing.price,
  })
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
