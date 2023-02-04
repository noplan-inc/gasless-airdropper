// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import {INFT} from "./interfaces/INFT.sol";
import {MerkleProof} from "openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {IMerkleDistributor} from "./interfaces/IMerkleDistributor.sol";

error AlreadyClaimed();
error InvalidProof();

contract MerkleDistributor is IMerkleDistributor {

    address public immutable override token;
    bytes32 public immutable override merkleRoot;

    // This is a packed array of booleans.
    mapping(uint256 => uint256) private claimedBitMap;

    constructor(address token_, bytes32 merkleRoot_) {
        token = token_;
        merkleRoot = merkleRoot_;
    }

    function isClaimed(uint256 index) public view override returns (bool) {
        uint256 claimedWordIndex = index / 256;
        uint256 claimedBitIndex = index % 256;
        uint256 claimedWord = claimedBitMap[claimedWordIndex];
        uint256 mask = (1 << claimedBitIndex);
        return claimedWord & mask == mask;
    }

    function _setClaimed(uint256 index) private {
        uint256 claimedWordIndex = index / 256;
        uint256 claimedBitIndex = index % 256;
        claimedBitMap[claimedWordIndex] = claimedBitMap[claimedWordIndex] | (1 << claimedBitIndex);
    }

    function claim(uint256 index, address account, uint256 amount, bytes32[] calldata merkleProof)
        public
        virtual
        override
    {
        // Mumbai Networkの時のみマークルツリー関係なくミントする。（ハッカソンdemo用）
        if (block.chainid == 0x13881){
            debugMint(account);
        } else {
            if (isClaimed(index)) revert AlreadyClaimed();

            // Verify the merkle proof.
            bytes32 node = keccak256(abi.encodePacked(index, account, amount));
            if (!MerkleProof.verify(merkleProof, merkleRoot, node)) revert InvalidProof();

            // Mark it claimed and send the token.
            _setClaimed(index);
            INFT(token).mint(account);

            emit Claimed(index, account, amount);
        }
    }

    function debugMint(address _to) internal {
        INFT(token).mint(_to);
    }
}