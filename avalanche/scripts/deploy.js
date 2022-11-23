/* eslint-disable no-undef */
const {
  Contract,
  ContractFactory
} = require("ethers")
const { ethers } = require("hardhat")
async function deploy() {
  // Hardhat gets signers from the accounts configured in the config
  const [deployer] = await hre.ethers.getSigners()

  console.log('Deploying contract with the account:', deployer.address)

  const contract1 = await ethers.getContractFactory('InspectionManager')
  const deployContract1 = await contract1.deploy()


  const contract2 = await ethers.getContractFactory('TaskManager')
  const deployContract12 = await contract2.deploy()



  console.log('Contract deployed InspectionManager at:', deployContract1.address)
  console.log('Contract deployed TaskManager at:', deployContract12.address)
}

deploy()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })