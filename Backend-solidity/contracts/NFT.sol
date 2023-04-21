// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721{
    uint256 public s_tokenCounter;
    mapping(uint256 => string) private s_tokenURIs;
    mapping(uint256 => address) private s_tokenCreator;

    event NFTMinted(address indexed tokenCreator, uint256 indexed tokenId);

    constructor() ERC721("NFT Token", "NFT") {
        s_tokenCounter = 0;
    }

    function mintNFT(string calldata tokenUri) public {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenURIs[s_tokenCounter] = tokenUri;
        s_tokenCreator[s_tokenCounter] = msg.sender;
        emit NFTMinted(msg.sender, s_tokenCounter);
        s_tokenCounter = s_tokenCounter + 1;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return s_tokenURIs[tokenId];
    }

    function getCreator(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return s_tokenCreator[tokenId];
    }

}
