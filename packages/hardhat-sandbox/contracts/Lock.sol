// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Lock {
    uint public unlockTime;

    event Withdrawal(uint amount, uint when);

    constructor() {

    }

    function withdraw(uint i) public {
        unlockTime = i;
    }
}
