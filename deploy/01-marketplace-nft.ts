import { developmentChainId, networkConfig } from "../helper-hardhat-config"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import verify from "../utils/verify"
import { DeployFunction } from "hardhat-deploy/dist/types"

const NftMarketplace: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { deployments, network, ethers } = hre
  const { deploy, log } = deployments
  const [deployer] = await ethers.getSigners()
  log("------ Start Deploy ------")
  const args: any[] = []
  const chainId = network.config.chainId!
  const nftMarketplace = await deploy("NftMarketplace", {
    from: deployer.address,
    args,
    log: true,
    waitConfirmations: networkConfig[chainId].waitBlockConfirmations,
  })
  log("------ Deploy Completed -----")
  if (!developmentChainId.includes(chainId) && process.env.ETHERSCAN_API_KEY) {
    log("------ Verify -----")
    await verify(nftMarketplace.address, args)
  }
}

export default NftMarketplace
NftMarketplace.tags = ["marketplace", "all", "main"]
