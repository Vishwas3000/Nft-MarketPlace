const { ethers, network } = require("hardhat")

const networkConfig = {
    default: {
        name: "hardhat",
    },
    31337: {
        name: "localhost",
    },
    5: {
        name: "goerli",
    },
    1: {
        name: "mainnet",
    },
    11155111: {
        name: "sepolia",
    },
    80001: {
        name: "polygonMumbai",
    },
}
const developmentChains = ["hardhat", "localhost"]

const frontEndAbiLocation = "../Frontend/nft_marketplace/constants/abi/"
const frontEndContractAddresses = "../Frontend/nft_marketplace/constants/addressMapping/contractAddressess.json"

module.exports = {
    networkConfig,
    developmentChains,
    frontEndAbiLocation,
    frontEndContractAddresses,
}
