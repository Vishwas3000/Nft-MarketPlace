const { frontEndAbiLocation, frontEndContractAddresses } = require("../helper-hardhat-config")
const fs = require("fs")
const { network } = require("hardhat")
require("dotenv").config()

module.exports = async () => {
    if (true) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateContractAddresses() {
    const chainId = network.config.chainId.toString()
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const nft = await ethers.getContract("NFT")
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractAddresses, "utf8"))
    console.log("NFT: ", nft.address)
    if (chainId in contractAddresses) {
        if ("NftMarketplace" in contractAddresses[chainId]) {
            contractAddresses[chainId]["NftMarketplace"] = nftMarketplace.address
        } else {
            contractAddresses[chainId] = { NftMarketplace: nftMarketplace.address }
        }
        if ("NFT" in contractAddresses[chainId]) {
            contractAddresses[chainId]["NFT"] = nft.address
        } else {
            contractAddresses[chainId] = { NFT: nft.address }
        }
    } else {
        contractAddresses[chainId] = {
            NftMarketplace: nftMarketplace.address,
            NFT: nft.address,
        }
    }
    fs.writeFileSync(frontEndContractAddresses, JSON.stringify(contractAddresses))
}

async function updateAbi() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const path = `${frontEndAbiLocation}NftMarketplace.json`
    fs.writeFileSync(
        `${frontEndAbiLocation}NftMarketplace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )

    const basicNft = await ethers.getContract("NFT")
    fs.writeFileSync(`${frontEndAbiLocation}NFT.json`, basicNft.interface.format(ethers.utils.FormatTypes.json))
}

module.exports.tags = ["all", "constants"]
