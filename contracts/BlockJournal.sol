// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract BlockJournal {
    uint256 totalJournals;

    constructor() {
        console.log("Contructor here, reporting for duty, WAGMI.");
    }

    function journal() public {
        totalJournals += 1;
        console.log("%s has journalled!", msg.sender);
    }

    function getTotalJournals() public view returns (uint256) {
        console.log("%d total journals!", totalJournals);
        return totalJournals;
    }
}