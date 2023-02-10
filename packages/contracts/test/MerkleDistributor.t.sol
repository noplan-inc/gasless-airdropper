// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/MerkleDistributor.sol";
import "../src/Nft.sol";

contract ContractTest is Test {
    address private wallet1;
    address private wallet2;
    address private wallet3;
    address private wallet4;
    address private wallet5;
    bytes32[] private hashes;
    Nft private nft;
    MerkleDistributor private merkleDistributor;
    function setUp() public {
        wallet1 = vm.addr(0x01);
        wallet2 = vm.addr(0x02);
        wallet3 = vm.addr(0x03);
        wallet4 = vm.addr(0x04);
        wallet5 = vm.addr(0x05); //dummy
        createMerkleTree([wallet1, wallet2, wallet3, wallet4]);
        nft = new Nft();
        merkleDistributor = new MerkleDistributor(address(nft), hashes[hashes.length - 1]);

    }

    function createMerkleTree(address[4] memory addresses) private {
        uint256 n = addresses.length;
        // address[2] memory addresses = [_wallet1, _wallet2];
        for(uint256 i = 0; i < addresses.length; i++){
            hashes.push(keccak256(abi.encodePacked(i, addresses[i], uint256(1))));
        }

        // uint256 n = addresses.length;
        uint256 offset = 0;

        while (n > 0) {
            for (uint256 i = 0; i < n - 1; i += 2) {
                hashes.push(
                    keccak256(
                        abi.encodePacked(
                            hashes[offset + i],
                            hashes[offset + i + 1]
                        )
                    )
                );
            }
            offset += n;
            n = n / 2;
        }
    }

    function testMerkleroot() public {
        assertEq(merkleDistributor.merkleRoot() ,hashes[hashes.length - 1]);
    }

    function testClaim() public {
        vm.startPrank(wallet1);
        bytes32[] memory merkleProof = new bytes32[](2);
        merkleProof[0] = hashes[1];
        merkleProof[1] = hashes[5];
        merkleDistributor.claim(0, wallet1, 1, merkleProof);
        assertEq(nft.balanceOf(wallet1), uint256(1));
    }

    function testRevert_Claim() public {
        vm.startPrank(wallet5);
        bytes32[] memory merkleProof = new bytes32[](2);
        merkleProof[0] = hashes[1];
        merkleProof[1] = hashes[5];
        vm.expectRevert(InvalidProof.selector);
        merkleDistributor.claim(0, wallet5, 1, merkleProof);
        vm.stopPrank();
        vm.startPrank(wallet1);
        vm.expectRevert(InvalidProof.selector);
        merkleDistributor.claim(1, wallet1, 1, merkleProof);
    }

    function testDebugMint() public {
        vm.startPrank(wallet2);
        vm.chainId(80001);
        bytes32[] memory merkleProof = new bytes32[](1);
        merkleProof[0] = hashes[1];
        merkleDistributor.claim(1, wallet2, 1, merkleProof);
        assertEq(nft.balanceOf(wallet2), uint256(1));
    }
}
