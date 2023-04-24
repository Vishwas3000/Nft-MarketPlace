import { useEffect, useState } from "react"
import { contractAddresses } from "@/constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { Button, Input, Card, useNotification } from "web3uikit"
import { GetTokenOwnerUtil } from "../utils/NftUtils"
import NftCard from "@/components/NftCard"

export default function Home() {
    const { account, chainId } = useMoralis()
    const { runContractFunction } = useWeb3Contract()

    const [tokenId, setTokenId] = useState(0)
    const [tokenIds, setTokenIds] = useState([])

    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"
    const nftAddress = contractAddresses[chainIdString]["NFT"]
    console.log("tokenIds: ", tokenIds)

    async function getTokenOwner() {
        const tokenOwner = await GetTokenOwnerUtil(nftAddress, runContractFunction, tokenId)
        return tokenOwner
    }

    return (
        <div className=" p-10 space-y-5">
            <Input
                placeholder="tokenId"
                onChange={async (event) => {
                    setTokenId(event.target.value)
                }}
            />
            <Button
                onClick={async () => {
                    const tokenOwner = await getTokenOwner()

                    const isOwnedByUser = tokenOwner.toLowerCase() === account.toLowerCase()
                    if (isOwnedByUser) {
                        setTokenIds((prevTokens) => [...prevTokens, parseInt(tokenId)])
                    } else {
                        alert("You do not own this token!")
                    }
                }}
                theme="colored"
                color="blue"
            />
            <div className="py-4 px-4 font-bold text-2xl">Current Owned Tokens</div>
            <div className="grid grid-cols-5 gap-6">
                {tokenIds.map((tokenId) => (
                    <NftCard tokenId={tokenId} />
                ))}
            </div>
        </div>
    )
}
