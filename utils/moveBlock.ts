import { mine } from "@nomicfoundation/hardhat-network-helpers"

const moveBlock = async (amount: number, sleepTime = 0) => {
  await mine(amount, { interval: sleepTime })
}
