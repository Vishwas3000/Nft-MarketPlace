import { ethers, toNumber } from "ethers"
import { nftAbi } from "@/constants"

async function GetTokenUriUtil(nftAddress, runContractFunction, tokenId) {
    const getTokenURIOpt = {
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: { tokenId },
    }
    const tokenURI = await runContractFunction({
        params: getTokenURIOpt,
        onSuccess: (result) => {
            console.log("tokenURI: ", result)
        },
        onError: (error) => {
            console.log("error: ", error)
        },
    })
    return tokenURI
}

async function ApproveTokenUtil(nftAddress, runContractFunction, toAddress, tokenId, onSuccess) {
    const approveTokenOpt = {
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "approve",
        params: { to: toAddress, tokenId },
    }

    const txReciept = await runContractFunction({
        params: approveTokenOpt,
        onSuccess: onSuccess,
        onError: (error) => {
            console.log("error: ", error)
        },
    })

    return txReciept
}

async function GetTokenCounterUtil(nftAddress, runContractFunction) {
    const getTokenCounterOpt = {
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "s_tokenCounter",
        params: {},
    }

    const tokenId = await runContractFunction({
        params: getTokenCounterOpt,

        onError: (error) => {
            console.log("error: ", error)
        },
    })

    console.log("tokenId: ", tokenId)

    return tokenId
}

async function GetTokenOwnerUtil(nftAddress, runContractFunction, tokenId) {
    const getTokenOwnerOpt = {
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "ownerOf",
        params: { tokenId },
    }
    const tokenOwner = await runContractFunction({
        params: getTokenOwnerOpt,
        onSuccess: (result) => {
            console.log("tokenOwner: ", result)
        },
        onError: (error) => {
            console.log("error: ", error)
        },
    })
    return tokenOwner
}

async function GetTokenCreatorUtil(nftAddress, runContractFunction, tokenId) {
    const getTokenCreatorOpt = {
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenCreator",
        params: { tokenId },
    }
    const tokenCreator = await runContractFunction({
        params: getTokenCreatorOpt,
        onSuccess: (result) => {
            console.log("tokenCreator: ", result)
        },
        onError: (error) => {
            console.log("error: ", error)
        },
    })
    return tokenCreator
}

async function MintNftUtil(nftAddress, runContractFunction, tokenUri, onMintSuccess, onMintFail) {
    const mintNftOpt = {
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "mintNFT",
        params: { tokenUri: tokenUri },
    }
    const txReciept = await runContractFunction({
        params: mintNftOpt,
        onSuccess: onMintSuccess,
        onError: (error) => {
            onMintFail()
            console.log("error: ", error)
        },
    })
    return txReciept
}

module.exports = {
    GetTokenUriUtil,
    GetTokenOwnerUtil,
    GetTokenCreatorUtil,
    MintNftUtil,
    GetTokenCounterUtil,
    ApproveTokenUtil,
}
