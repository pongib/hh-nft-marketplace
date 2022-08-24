const { ethers, network } = require("hardhat")
import { mine } from "@nomicfoundation/hardhat-network-helpers"
// const { moveBlocks } = require("../utils/move-blocks")

const PRICE = ethers.utils.parseEther("0.1")

async function mintAndList() {
  const nftMarketplace = await ethers.getContract("NftMarketplace")
  const randomNumber = Math.floor(Math.random() * 2)

  let basicNft = await ethers.getContract("BasicNft")
  // if (randomNumber == 1) {
  //   basicNft = await ethers.getContract("BasicNftTwo")
  // } else {
  //   basicNft = await ethers.getContract("BasicNft")
  // }
  console.log("Minting NFT...")
  const mintTx = await basicNft.mintNft()
  const mintTxReceipt = await mintTx.wait(1)
  const tokenId = mintTxReceipt.events[0].args.tokenId
  console.log("Approving NFT...")
  const approvalTx = await basicNft.approve(nftMarketplace.address, tokenId)
  await approvalTx.wait(1)
  console.log("Listing NFT...")
  const tx = await nftMarketplace.listItem(basicNft.address, tokenId, PRICE)
  await tx.wait(1)
  console.log(`NFT Listed! with ${tokenId}`)

  if (network.config.chainId == 31337) {
    // Moralis has a hard time if you move more than 1 at once!
    console.log("mine")

    await mine(2, { interval: 2 })
  }
}

mintAndList()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
