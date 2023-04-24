import { GetTokenUriUtil, GetTokenOwnerUtil } from "../utils/NftUtils"
import { Card } from "web3uikit"
import { useState, useEffect } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { contractAddresses } from "@/constants"
import Image from "next/image"

const truncateStr = (fullStr, strLen) => {
    console.log("fullStr: ", fullStr)
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return fullStr.substring(0, frontChars) + separator + fullStr.substring(fullStr.length - backChars)
}

export default function NftCardCreator({ tokenId }) {
    const { isWeb3Enabled, account, chainId } = useMoralis()

    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"
    const nftAddress = contractAddresses[chainIdString]["NFT"]

    const [imageURI, setImageUri] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [tokenOwner, setTokenOwner] = useState("")

    const { runContractFunction } = useWeb3Contract()

    async function updateUI() {
        const tokenUri = await GetTokenUriUtil(nftAddress, runContractFunction, tokenId)

        if (tokenUri) {
            const requestURL = tokenUri.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/")
            const tokenUriResponse = await (await fetch(requestURL)).json()
            const imageUri = tokenUriResponse.tokenUriMetadata.image

            const imageUriUrl = imageUri.replace("https://ipfs.io/ipfs/", "https://cloudflare-ipfs.com/ipfs/")
            // console.log("imageUriUrl: ", imageUriUrl)

            setImageUri(imageUriUrl)
            setTokenName(tokenUriResponse.tokenUriMetadata.name)
            setTokenDescription(tokenUriResponse.tokenUriMetadata.description)
        }
    }

    async function getTokenOwner() {
        const tokenOwner = await GetTokenOwnerUtil(nftAddress, runContractFunction, tokenId)
        setTokenOwner(tokenOwner)
        return tokenOwner
    }

    useEffect(() => {
        getTokenOwner()
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled, chainId])

    return (
        <div>
            {imageURI ? (
                <div>
                    <Card title={tokenName} description={tokenDescription}>
                        <div className="p-2">
                            <div className="flex flex-col items-end gap-2">
                                <div>#{tokenId}</div>
                                <div className="italic text-sm">Created by {"you"}</div>
                                <div className="italic text-sm">
                                    Owned by{" "}
                                    {tokenOwner.toLowerCase() === account.toLowerCase()
                                        ? "you"
                                        : truncateStr(tokenOwner, 15)}{" "}
                                </div>
                                <Image loader={() => imageURI} src={imageURI} height="200" width="200" />
                            </div>
                        </div>
                    </Card>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}
