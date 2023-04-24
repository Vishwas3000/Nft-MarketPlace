import { useEffect, useState } from "react"
import { contractAddresses, BLOCK_WAIT_TIME } from "@/constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { Button, Input, Card, useNotification } from "web3uikit"
import { GetTokenCreatorUtil } from "../utils/NftUtils"
import NftCardCreator from "@/components/NftCardCreator"
import { getProceedsUtil, withdrawProceedsUtil } from "../utils/marketplaceUtil"

export default function Home() {
    const { isWeb3Enabled, account, chainId } = useMoralis()
    const { runContractFunction } = useWeb3Contract()

    const dispatch = useNotification()

    const [tokenId, setTokenId] = useState(0)
    const [tokenIds, setTokenIds] = useState([])
    const [withdrawProceedAmount, setWithdrawProceedAmount] = useState(0)

    useEffect(() => {
        checkProceeds()
    }, [chainId, account, isWeb3Enabled])

    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"
    const nftAddress = contractAddresses[chainIdString]["NFT"]
    const marketplaceAddress = contractAddresses[chainIdString]["NftMarketplace"]
    console.log("tokenIds: ", tokenIds)

    async function withdrawProceeds() {
        await withdrawProceedsUtil(marketplaceAddress, runContractFunction, handleWithdrawSuccess)
    }

    async function checkProceeds() {
        const proceeds = await getProceedsUtil(marketplaceAddress, runContractFunction, account, tokenId)
        setWithdrawProceedAmount(proceeds)
    }

    async function getTokenCreator() {
        const tokenCreator = await GetTokenCreatorUtil(nftAddress, runContractFunction, tokenId)
        return tokenCreator
    }

    const handleWithdrawSuccess = (tx) => {
        tx.wait(BLOCK_WAIT_TIME)
        dispatch({
            type: "success",
            title: "Withdraw Proceeds",
            message: "Successfully withdrew proceeds",
        })
    }

    return (
        <div className=" p-10 space-y-5">
            <div className=" p-5 space-y-10">
                <div className="font-bold text-2xl">WithDraw</div>
                <div className="space-y-5">
                    <div> Current Proceeds {withdrawProceedAmount} ETH</div>
                    <Button
                        onClick={() => {
                            withdrawProceeds()
                        }}
                        theme="colored"
                        color="green"
                        text="Withdraw Proceeds"
                    />
                </div>
            </div>
            <Input
                placeholder="tokenId"
                onChange={async (event) => {
                    setTokenId(event.target.value)
                }}
            />
            <Button
                onClick={async () => {
                    const tokenCreator = await getTokenCreator()
                    console.log("tokenCreator: ", tokenCreator)

                    const isCreatedByUser = tokenCreator.toLowerCase() === account.toLowerCase()
                    if (isCreatedByUser) {
                        setTokenIds((prevTokens) => [...prevTokens, parseInt(tokenId)])
                    } else {
                        alert("You do not own this token!")
                    }
                }}
                theme="colored"
                color="blue"
                text="ADD TOKEN"
            />
            <div className="py-4 px-4 font-bold text-2xl">Created Tokens</div>
            <div className="grid grid-cols-5 gap-6">
                {tokenIds.map((tokenId) => (
                    <NftCardCreator tokenId={tokenId} />
                ))}
            </div>
        </div>
    )
}
