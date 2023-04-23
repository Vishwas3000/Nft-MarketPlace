import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="border-b-4 border-solid p-5 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl">NFT Marketplace</h1>
            <div className="flex flex-row items-center">
                <Link href="/" className="mr-4 p-6">
                    Buy
                </Link>
                <Link href="/mint-NFT" className="mr-4 p-6">
                    Mint
                </Link>
                <Link href="/dashboard" className="mr-4 p-6">
                    My Dashboard
                </Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
