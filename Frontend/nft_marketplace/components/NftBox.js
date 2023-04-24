import { useState, useEffect } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { Card, useNotification } from "web3uikit"
import { ethers } from "ethers"
import UpdateListingModal from "./UpdateListingModal"
import { GetTokenUriUtil } from "../utils/NftUtils"
import Image from "next/image"
import { buyItemUtil } from "@/utils/marketplaceUtil"

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return fullStr.substring(0, frontChars) + separator + fullStr.substring(fullStr.length - backChars)
}

export default function NftBox({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageUri] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)
    const dispatch = useNotification()
    const { runContractFunction } = useWeb3Contract()

    async function updateUI() {
        const tokenUri = await GetTokenUriUtil(nftAddress, runContractFunction, tokenId)
        console.log("tokenUri: ", tokenUri)

        if (tokenUri) {
            const requestURL = tokenUri.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/")
            const tokenUriResponse = await (await fetch(requestURL)).json()
            const imageUri = tokenUriResponse.tokenUriMetadata.image

            const imageUriUrl = imageUri.replace("https://ipfs.io/ipfs/", "https://cloudflare-ipfs.com/ipfs/")

            setImageUri(imageUriUrl)
            setTokenName(tokenUriResponse.tokenUriMetadata.name)
            setTokenDescription(tokenUriResponse.tokenUriMetadata.description)
        }
    }

    async function buyItem() {
        // console.log("Price: ", price)
        const priceInEth = ethers.utils.formatEther(price.toString())
        console.log("Price in Eth: ", priceInEth)
        await buyItemUtil(
            marketplaceAddress,
            runContractFunction,
            nftAddress,
            tokenId,
            priceInEth,
            handleBuyItemSuccess
        )
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const isOwnedByUser = seller === account || seller === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)

    const handleCardClick = () => {
        console.log(`Clicked on ${tokenName}!`)
        isOwnedByUser ? setShowModal(true) : buyItem()
    }

    const handleBuyItemSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Item bought!",
            title: "Item Bought",
            position: "topR",
        })
    }

    return (
        <div>
            <div>
                {imageURI ? (
                    <div>
                        <UpdateListingModal
                            isVisible={showModal}
                            tokenId={tokenId}
                            marketplaceAddress={marketplaceAddress}
                            nftAddress={nftAddress}
                            onClose={hideModal}
                        />
                        <Card title={tokenName} description={tokenDescription} onClick={handleCardClick}>
                            <div className="p-2">
                                <div className="flex flex-col items-end gap-2">
                                    <div>#{tokenId}</div>
                                    <div className="italic text-sm">Owned by {formattedSellerAddress}</div>
                                    <Image loader={() => imageURI} src={imageURI} height="200" width="200" />
                                    <div className="font-bold">{ethers.utils.formatUnits(price, "ether")} ETH</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    )
}
