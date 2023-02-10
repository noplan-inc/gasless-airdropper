// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/MerkleDistributor.sol";
import "../src/Nft.sol";


contract MerkleDistributorScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        Nft nft = new Nft();
        // 本来は第二引数にマークルツリーのルートを渡すが、今回はダミー
        MerkleDistributor merkleDistributor = new MerkleDistributor(address(nft), bytes32(0x00));
        nft.setAirdropAddress(address(merkleDistributor));

        vm.stopBroadcast();
    }
}
