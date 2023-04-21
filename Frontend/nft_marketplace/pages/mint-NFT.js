import { useEffect, useState } from "react"
import { Button, Upload, Input } from "web3uikit"
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
    const [image, setImage] = useState(null)
    const [nftName, setNftName] = useState("")
    const [nftDescription, setNftDescription] = useState("")
    const [nftPrice, setNftPrice] = useState("")

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

    const handleTokenUri = async () => {
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

        tokenUriMetadata.name = nftName
        tokenUriMetadata.description = nftDescription
        tokenUriMetadata.image = `ipfs://${ipfsImageData.IpfsHash}`

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
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            Mint NFT
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
            <Input
                // description="Enter name of the NFT"
                label="NFT Name"
                name="Test text Input"
                onChange={function noRefCheck(event) {
                    setNftName(event.target.value)
                }}
            />
            <Input
                // description="Enter description of the NFT"
                label="NFT Description"
                name="Test text Input"
                onChange={function noRefCheck(event) {
                    setNftDescription(event.target.value)
                }}
            />
            <Button
                color="green"
                onClick={function noRefCheck() {
                    handleTokenUri()
                }}
                text="Upload Metadata"
                theme="colored"
            />
        </div>
    )
}
