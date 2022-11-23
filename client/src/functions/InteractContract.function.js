import { ethers, utils } from 'ethers'
// import avaxboxContract from '../../../avalanche/artifacts/contracts/Avaxbox.sol/Avaxbox.json'
import inspectionManager from '../artifacts/contracts/InspectionManager.sol/InspectionManager.json'
import taskManager from '../artifacts/contracts/TaskManager.sol/TaskManager.json'

export const inspectionAddress ='0xc02f6423E0A286FE69CdB6473E8B63a94860f6d0'
export const taskManagerAddress ='0x517A3c62BDe89A6E0BA51F848C593adc0819b102'
export const setUpContractInterface = async ( setContractInterface) => {
  if (window.ethereum) {
    await window.ethereum.enable()
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // Get the signer (defaults to the currently selected account)
    const signer = provider.getSigner()
    
    // Initialise the contract instance
    const inspectionManagerContract = new ethers.Contract(
      inspectionAddress,
      inspectionManager.abi,
      signer
    )
    const taskManagerContract = new ethers.Contract(
      taskManagerAddress,
      taskManager.abi,
      signer
    )
    // Store this instance in the state
    setContractInterface({inspectionManagerContract, taskManagerContract})
  }
}

