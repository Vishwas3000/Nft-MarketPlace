import { GetTokenUriUtil } from "../utils/NftUtils"
import { Card } from "web3uikit"
import { useState, useEffect } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { contractAddresses } from "@/constants"
import Image from "next/image"

export default function NftCard({ tokenId }) {
    const { isWeb3Enabled, account, chainId } = useMoralis()

    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"
    const nftAddress = contractAddresses[chainIdString]["NFT"]

    const [imageURI, setImageUri] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)

    console.log("account: ", account)

    const { runContractFunction } = useWeb3Contract()

    async function updateUI() {
        const tokenUri = await GetTokenUriUtil(nftAddress, runContractFunction, tokenId)
        console.log("tokenUri: ", tokenUri)

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

    const handleCardClick = () => {
        console.log(`Clicked on ${tokenName}!`)
        isOwnedByUser
            ? setShowModal(true)
            : buyItem({
                  onError: (error) => console.log(error),
                  onSuccess: handleBuyItemSuccess,
              })
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled, chainId])

    return (
        <div>
            <Card title={tokenName} description={tokenDescription} onClick={handleCardClick}>
                <div className="p-2">
                    <div className="flex flex-col items-end gap-2">
                        <div>#{tokenId}</div>
                        <div className="italic text-sm">Owned by {"you"}</div>
                        <Image loader={() => imageURI} src={imageURI} height="200" width="200" />
                    </div>
                </div>
            </Card>
        </div>
    )
}
