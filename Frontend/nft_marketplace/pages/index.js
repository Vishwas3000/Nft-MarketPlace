import { useMoralis } from "react-moralis"
import GET_ACTIVE_ITEMS from "../constants/subGraphQueries"
import { contractAddresses } from "../constants/index"
import { useQuery } from "@apollo/client"
import NftBox from "@/components/NftBox"

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()

    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"
    const marketPlaceAddress = contractAddresses[chainIdString]["NftMarketplace"]

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)
    console.log("Listed Nfts: ", listedNfts)

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    loading || !listedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.activeItems.map((nft) => {
                            console.log(nft)
                            const { price, nftAddress, tokenId, seller } = nft
                            return (
                                <NftBox
                                    price={price}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    marketplaceAddress={marketPlaceAddress}
                                    seller={seller}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
