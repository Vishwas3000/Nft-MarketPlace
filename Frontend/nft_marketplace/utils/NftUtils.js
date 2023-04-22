import { ethers } from "ethers"

async function GetTokenPriceUtil(contractAddress, contractAbi, runContractFunction, tokenId) {
    const getTokenPriceOpt = {
        abi: contractAbi,
        contractAddress: contractAddress,
        functionName: "getTokenPrice",
        params: { tokenId },
    }
    const tokenPriceInWei = await runContractFunction({
        params: getTokenPriceOpt,
        onSuccess: (result) => {
            console.log("tokenPrice: ", result)
        },
        onError: (error) => {
            console.log("error: ", error)
        },
    })

    const tokenPriceInEth = ethers.utils.formatEther(tokenPriceInWei)
    console.log("tokenPriceInEth: ", tokenPriceInEth)
    return tokenPriceInEth
}

async function GetTokenUriUtil(contractAddress, contractAbi, runContractFunction, tokenId) {
    const getTokenURIOpt = {
        abi: contractAbi,
        contractAddress: contractAddress,
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

async function GetTokenOwnerUtil(contractAddress, contractAbi, runContractFunction, tokenId) {
    const getTokenOwnerOpt = {
        abi: contractAbi,
        contractAddress: contractAddress,
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

async function GetTokenCreatorUtil(contractAddress, contractAbi, runContractFunction, tokenId) {
    const getTokenCreatorOpt = {
        abi: contractAbi,
        contractAddress: contractAddress,
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

async function MintNftUtil(
    contractAddress,
    contractAbi,
    runContractFunction,
    tokenUri,
    tokenPrice,
    onMintSuccess,
    onMintFail
) {
    const tokenPriceInWei = ethers.utils.parseEther(tokenPrice)
    console.log("tokenPriceInWei: ", tokenPriceInWei)
    const mintNftOpt = {
        abi: contractAbi,
        contractAddress: contractAddress,
        functionName: "mintNFT",
        params: { tokenUri: tokenUri, tokenPrice: tokenPriceInWei },
    }
    const txReciept = await runContractFunction({
        params: mintNftOpt,
        onSuccess: onMintSuccess,
        onError: (error) => {
            onMintFail()
            console.log("error: ", error)
        },
    })
    console.log("txReciept: ", txReciept)
}

module.exports = { GetTokenPriceUtil, GetTokenUriUtil, GetTokenOwnerUtil, GetTokenCreatorUtil, MintNftUtil }
