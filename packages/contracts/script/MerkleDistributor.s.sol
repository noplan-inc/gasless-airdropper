// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/MerkleDistributor.sol";
import "../src/NftDemo.sol";


contract MerkleDistributorScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        NftDemo nft = new NftDemo();
        // 本来は第二引数にマークルツリーのルートを渡すが、今回はダミー
        new MerkleDistributor(address(nft), bytes32(0x00));
        vm.stopBroadcast();
    }
}
