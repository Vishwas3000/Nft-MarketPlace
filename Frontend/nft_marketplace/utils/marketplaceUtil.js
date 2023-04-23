import { ethers } from "ethers"
import { nftMarketplaceAbi } from "../constants/index"

async function listItemUtil(marketplaceAddress, runContractFunction, nftAddress, tokenId, tokenPrice, onSuccess) {
    const tokenPriceInWei = ethers.utils.parseEther(tokenPrice)
    const listItemOpt = {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "listItem",
        params: { nftAddress, tokenId, price: tokenPriceInWei },
    }

    const txReciept = await runContractFunction({
        params: listItemOpt,
        onSuccess: onSuccess,
        onError: (error) => {
            console.log("error: ", error)
        },
    })
    return txReciept
}

async function buyItemUtil(marketplaceAddress, runContractFunction, nftAddress, tokenId, tokenPrice, onSuccess) {
    const tokenPriceInWei = ethers.utils.parseEther(tokenPrice)
    const buyItemOpt = {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: tokenPriceInWei,
        params: { nftAddress, tokenId },
    }

    const txReciept = await runContractFunction({
        params: buyItemOpt,
        onSuccess: onSuccess,
        onError: (error) => {
            console.log("error: ", error)
        },
    })

    return txReciept
}

async function cancleItemUtil(marketplaceAddress, runContractFunction, nftAddress, tokenId, onSuccess) {
    const cancleItemOpt = {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "cancleItem",
        params: { nftAddress, tokenId },
    }

    const txReciept = await runContractFunction({
        params: cancleItemOpt,
        onSuccess: onSuccess,
        onError: (error) => {
            console.log("error: ", error)
        },
    })

    return txReciept
}

async function updateListingUtil(marketplaceAddress, runContractFunction, nftAddress, tokenId, tokenPrice, onSuccess) {
    const tokenPriceInWei = ethers.utils.parseEther(tokenPrice)
    const updateListingOpt = {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: { nftAddress, tokenId, newPrice: tokenPriceInWei },
    }

    const txReciept = await runContractFunction({
        params: updateListingOpt,
        onSuccess: onSuccess,
        onError: (error) => {
            console.log("error: ", error)
        },
    })

    return txReciept
}

async function withdrawProceedsUtil(marketplaceAddress, runContractFunction, account, onSuccess) {
    const withdrawProceedsOpt = {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "withdrawProceeds",
        params: {},
    }

    const txReciept = await runContractFunction({
        params: withdrawProceedsOpt,
        onSuccess: onSuccess,
        onError: (error) => {
            console.log("error: ", error)
        },
    })

    return txReciept
}

module.exports = { listItemUtil, buyItemUtil, cancleItemUtil, updateListingUtil, withdrawProceedsUtil }
