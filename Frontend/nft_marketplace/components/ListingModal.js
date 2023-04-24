import { Modal, Input, useNotification, Button } from "web3uikit"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { listItemUtil } from "../utils/marketplaceUtil"
import { ApproveTokenUtil, checkIfApprovedUtil } from "../utils/NftUtils"

export default function ListingModal({ nftAddress, tokenId, isVisible, marketplaceAddress, onClose }) {
    const dispatch = useNotification()
    const { runContractFunction } = useWeb3Contract()

    const [listingPrice, setListingPrice] = useState("0")
    const [ifApproved, setIfApproved] = useState(false)

    const handleListingSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Item listed!",
            title: "Listing Success, please wait for the transaction to be mined",
            position: "topR",
        })
        onClose && onClose()
        setListingPrice("0")
    }

    // Update Listing
    const listItem = async () => {
        await listItemUtil(
            marketplaceAddress,
            runContractFunction,
            nftAddress,
            tokenId,
            listingPrice,
            handleListingSuccess
        )
    }

    const handleApproveNft = async () => {
        await ApproveTokenUtil(nftAddress, runContractFunction, marketplaceAddress, tokenId, handleApproveSuccess)
    }

    const handleApproveSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "NFT approved!",
            title: "NFT Approved for marketplace",
            position: "topR",
        })
    }

    const checkIfApproved = async () => {
        const isApproved = await checkIfApprovedUtil(nftAddress, runContractFunction, marketplaceAddress, tokenId)
        setIfApproved(isApproved)
    }

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                listItem()
            }}
        >
            <div className=" flex flex-col space-y-5 p-5">
                {ifApproved ? (
                    <div>Approved to marketplace</div>
                ) : (
                    <div>
                        <Button
                            onClick={() => {
                                handleApproveNft()
                            }}
                            theme="colored"
                            color="blue"
                            text="Approve marketplace"
                        />
                    </div>
                )}

                <Input
                    label="Update listing price in L1 Currency (ETH)"
                    name="New listing price"
                    type="number"
                    onChange={(event) => {
                        setListingPrice(event.target.value)
                    }}
                />
            </div>
        </Modal>
    )
}
