import { useEffect, useState } from "react"
import { Button, Upload, Input, useNotification } from "web3uikit"
import { MintNftUtil, GetTokenCounterUtil } from "../utils/NftUtils"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { contractAddresses } from "../constants"
import axios from "axios"

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "Cuteness",
            value: 100,
        },
    ],
}

export default function MintNFT() {
    const { isWeb3Enabled, account, chainId } = useMoralis()
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()

    const [image, setImage] = useState(null)
    const [nftName, setNftName] = useState("")
    const [nftDescription, setNftDescription] = useState("")
    const [isMinting, setIsMinting] = useState(false)
    const [currentTokenCount, setCurrentTokenCount] = useState(0)

    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"

    const nftAddress = contractAddresses[chainIdString]["NFT"]
    console.log("nftAddress: ", nftAddress)

    useEffect(() => {
        GetTokenId()
    }, [isWeb3Enabled, chainId, isMinting])

    const rename = (name) => {
        let temp = name
        temp = temp.split(".")
        temp[temp.length - 1] = ""
        return temp[0]
    }

    const pinFileToIPFS = async (file) => {
        let data

        const formData = new FormData()
        formData.append("file", file)

        const metadata = JSON.stringify({
            name: rename(file.name),
        })
        formData.append("pinataMetadata", metadata)

        const options = JSON.stringify({
            cidVersion: 0,
        })
        formData.append("pinataOptions", options)

        try {
            const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
                method: "POST",
                headers: {
                    pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
                    pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
                },
                body: formData,
            })

            data = await response.json()
            console.log(data)
            // Response example:
            // {
            //   IpfsHash: "QmZ4f4Z4mXYi53YkjQ9tvBvyBXcCPyjkrT1dC1q3qf4AS4",
            //   PinSize: 2239,
            //   Timestamp: "2022-10-17T00:18:26.033Z"
            // }
        } catch (error) {
            console.log(error)
        }
        return data
    }

    const uploadTokenUri = async () => {
        let tokenUriMetadata = { ...metadataTemplate }

        // "pinataOptions": {
        //     "cidVersion": 1
        //   },
        //   "pinataMetadata": {
        //     "name": "testing",
        //     "keyvalues": {
        //       "customKey": "customValue",
        //       "customKey2": "customValue2"
        //     }
        //   },
        //   "pinataContent": {
        //     "somekey": "somevalue"
        //   }

        const ipfsImageData = await pinFileToIPFS(image)
        let tokenUri

        tokenUriMetadata.name = nftName
        tokenUriMetadata.description = nftDescription
        tokenUriMetadata.image = `https://ipfs.io/ipfs/${ipfsImageData.IpfsHash}`

        let metadataToUpload = {
            pinataOptions: {
                cidVersion: 1,
            },

            pinataMetadata: {
                name: nftName,
            },
            pinataContent: {
                tokenUriMetadata,
            },
        }

        console.log("metadata: ", metadataToUpload)

        console.log(`Uploading ${tokenUriMetadata.name} metadata to IPFS`)

        const config = {
            method: "post",
            url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
            headers: {
                "Content-Type": "application/json",
                pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
                pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
            },
            data: metadataToUpload,
        }
        try {
            const response = await axios(config)
            tokenUri = response.data.IpfsHash
            onIpfsSuccess(response.data)
        } catch (error) {
            console.log(error)
            onIpfsFail()
        }
        return tokenUri
    }

    const handleMintToken = async () => {
        setIsMinting(true)
        let tokenUri = await uploadTokenUri()
        tokenUri = `ipfs://${tokenUri}`
        console.log("tokenUri: ", tokenUri)
        await MintNftUtil(nftAddress, runContractFunction, tokenUri, onMintSuccess, onMintFailed)
    }

    const GetTokenId = async () => {
        const tokenCount = await GetTokenCounterUtil(nftAddress, runContractFunction)
        setCurrentTokenCount(tokenCount)
    }

    const onIpfsSuccess = async (data) => {
        console.log("IPFS success")
        console.log(data)
        dispatch({
            type: "success",
            title: "IPFS success",
            position: "topR",
            message: "Your NFT has been uploaded to IPFS successfully",
        })
    }

    const onIpfsFail = async () => {
        console.log("IPFS failed")
        dispatch({
            type: "error",
            title: "IPFS failed",
            position: "topR",
            message: "Your NFT has not been uploaded to IPFS",
        })
    }

    const onMintSuccess = async (tx) => {
        console.log("Minted successfully")
        dispatch({
            type: "success",
            title: "Minted successfully",
            position: "topR",
            message: `Your NFT successfully minted ID: ${currentTokenCount}`,
        })
        setIsMinting(false)
    }

    const onMintFailed = async (tx) => {
        console.log("Minting failed")
        dispatch({
            type: "error",
            title: "Minting failed",
            position: "topR",
            message: "Your NFT has not been minted",
        })
        setIsMinting(false)
    }

    return (
        <div className=" flex flex-col p-11 space-x-5 space-y-5">
            <div className="font-bold text-2xl">MintNFT</div>

            <div className=" flex justify-start place-content-start w-1/3">
                <Upload
                    acceptedFiles="image/*"
                    descriptionText="Only images are supported"
                    onChange={function noRefCheck(file) {
                        console.log(file)
                        setImage(file)
                    }}
                    style={{}}
                    theme="withIcon"
                />
            </div>
            <div className=" flex flex-col justify-start space-y-5">
                <Input
                    // description="Enter name of the NFT"
                    label="NFT Name"
                    name="Test text Input"
                    onChange={(event) => {
                        setNftName(event.target.value)
                    }}
                />
                <Input
                    // description="Enter description of the NFT"
                    label="NFT Description"
                    name="Test text Input"
                    onChange={(event) => {
                        setNftDescription(event.target.value)
                    }}
                />
            </div>
            <div className=" py-10">
                <Button
                    color="green"
                    onClick={() => {
                        handleMintToken()
                    }}
                    text="Mint token"
                    theme="colored"
                    isLoading={isMinting}
                />
            </div>
        </div>
    )
}
