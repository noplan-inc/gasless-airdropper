// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import "openzeppelin/contracts/token/ERC721/ERC721.sol";
import "openzeppelin/contracts/utils/Counters.sol";
import "openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "openzeppelin/contracts/access/Ownable.sol";

contract Nft is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    address public airdropAddress;  
    constructor()ERC721("Nft", "NFT"){}

    function safeMint(address to, string calldata uri) external {
        require(msg.sender == airdropAddress, "Please call me from airdrop contract.");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function setAirdropAddress (address to) public onlyOwner{
        airdropAddress = to;
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