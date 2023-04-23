import { Modal, Input, useNotification } from "web3uikit"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { updateListingUtil } from "../utils/marketplaceUtil"

export default function UpdateListingModal({ nftAddress, tokenId, isVisible, marketplaceAddress, onClose }) {
    const dispatch = useNotification()
    const { runContractFunction } = useWeb3Contract()

    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0)

    const handleUpdateListingSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "listing updated",
            title: "Listing updated - please refresh (and move blocks)",
            position: "topR",
        })
        onClose && onClose()
        setPriceToUpdateListingWith("0")
    }

    // Update Listing
    const updateListing = async ({ onError, onSuccess }) => {
        const tx = await updateListingUtil(
            marketplaceAddress,
            runContractFunction,
            nftAddress,
            tokenId,
            priceToUpdateListingWith,
            onSuccess
        )
    }

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                updateListing({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: handleUpdateListingSuccess,
                })
            }}
        >
            <Input
                label="Update listing price in L1 Currency (ETH)"
                name="New listing price"
                type="number"
                onChange={(event) => {
                    setPriceToUpdateListingWith(event.target.value)
                }}
            />
        </Modal>
    )
}
