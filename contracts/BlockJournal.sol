// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract BlockJournal {
    uint256 totalJournals;

    // Stores given arguments passed in the transaction logs on the blockchain. That can be easily accessed in the application.
    event NewJournal(address indexed from, uint256 timestamp, string message);

    // A stuct is a custom datatype where the function can be customised to hold key value pairs.
    struct Journal {
        address journaler; // The address of the user who journalled.
        string message; // The journal the user just logged.
        uint256 timestamp; // The timestamp when the user wrote the journal.
    }

 Journal[] journals;


    constructor() payable {
        console.log("SMART CONTRACT HERE REPORTING FOR DUTY, WAGMI.");
    }

    // Logs the jounral logged by a users from the frontend.
    function journal(string memory _message) public {
        totalJournals += 1;
        console.log("%s has journaled!", msg.sender);
    
    // Stores the journal data in an array
    journals.push(Journal(msg.sender, _message, block.timestamp));


    // Emits a new journal which can be seen on the client side of the Dapp.
    emit NewJournal(msg.sender, block.timestamp, _message);

    // Equal to $0.31
    uint256 prizeAmount = 0.0001 ether;

    require(
        prizeAmount <=address(this).balance,
        "Trying to withdraw more money than the contract has."
    );
    (bool success, ) = (msg.sender).call{value: prizeAmount}("");
    require (success, "Failed to withdraw money from contract.");

    }


    // Returns the struct array, journals.
    function getAllJournals() public view returns (Journal[] memory) {
        return journals;
    }


    function getTotalJournals() public view returns (uint256) {
        console.log("%d total journals!", totalJournals);
        return totalJournals;
    }
}