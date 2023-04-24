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
                        <div className="grid grid-cols-5 gap-6 p-10 ">
                            {listedNfts.activeItems.map((nft) => (
                                <NftBox
                                    price={nft.price}
                                    nftAddress={nft.nftAddress}
                                    tokenId={nft.tokenId}
                                    marketplaceAddress={marketPlaceAddress}
                                    seller={nft.seller}
                                    key={`${nft.nftAddress}${nft.tokenId}`}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
