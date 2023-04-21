import { useEffect, useState } from "react"
import { Button, Upload } from "web3uikit"

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

    const pinFileToIPFS = async (file) => {
        const formData = new FormData()
        formData.append("file", file.name)

        const metadata = JSON.stringify({
            name: "File name",
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

            const data = await response.json()
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
            <Button
                color="green"
                onClick={function noRefCheck() {
                    pinFileToIPFS(image)
                }}
                text="Colored Button: Green"
                theme="colored"
            />
        </div>
    )
}
