// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import "openzeppelin/contracts/token/ERC721/ERC721.sol";
import "openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./interfaces/INFT.sol";

contract Nft is ERC721, ERC721URIStorage, INFT {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    constructor()ERC721("Nft", "NFT"){}

    function safeMint(address to, string memory uri) public{
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}