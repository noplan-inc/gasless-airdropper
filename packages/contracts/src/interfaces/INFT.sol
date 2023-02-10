// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

// Merkle Distributorコントラクト先に書いたので、適当なNFTインターフェース作成

interface INFT{
    function mint(address to) external;
    function safeMint(address to, string calldata uri) external;
}

