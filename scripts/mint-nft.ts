const { ethers, network } = require("hardhat")
import { mine } from "@nomicfoundation/hardhat-network-helpers"

async function main() {
  const [, account2] = await ethers.getSigners()
  console.log("account2 address", account2.address)

  let basicNft = await ethers.getContract("BasicNft")
  console.log("Minting NFT...")
  const mintTx = await basicNft.mintNft()
  const mintTxReceipt = await mintTx.wait(1)
  const tokenId = mintTxReceipt.events[0].args.tokenId
  console.log(`Token ID: ${tokenId}`)
  console.log(`NFT Address: ${basicNft.address}`)

  if (network.config.chainId == 31337) {
    // Moralis has a hard time if you move more than 1 at once!
    console.log("mine")
    await mine(2, { interval: 2 })
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
