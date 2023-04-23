import { useEffect, useState } from "react"
import { contractAddresses } from "@/constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { Button, Input, Card, useNotification } from "web3uikit"
import { GetTokenUriUtil } from "../utils/NftUtils"
import NftCard from "@/components/NftCard"

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const { runContractFunction } = useWeb3Contract()

    const [tokenId, setTokenId] = useState(0)
    const [tokenIds, setTokenIds] = useState([0])

    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"
    const nftAddress = contractAddresses[chainIdString]["NFT"]
    console.log("tokenIds: ", tokenIds)

    return (
        <div className=" p-10 space-y-5">
            <Input
                placeholder="tokenId"
                onChange={async (event) => {
                    setTokenId(event.target.value)
                }}
            />
            <Button
                onClick={() => {
                    setTokenIds((prevTokens) => [...prevTokens, parseInt(tokenId)])
                }}
                theme="colored"
                color="blue"
            />
            <div className="grid grid-cols-5 gap-6">
                {tokenIds.map((tokenId) => (
                    <NftCard tokenId={tokenId} />
                ))}
            </div>
        </div>
    )
}
