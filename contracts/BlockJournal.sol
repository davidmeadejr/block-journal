// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract BlockJournal {
    uint256 totalJournals;

    // Generates a random number
    uint256 private seed;

    // Stores given arguments passed in the transaction logs on the blockchain. That can be easily accessed in the application.
    event NewJournal(address indexed from, uint256 timestamp, string message);

    // A stuct is a custom datatype where the function can be customised to hold key value pairs.
    struct Journal {
        address journaler; // The address of the user who journalled.
        string message; // The journal the user just logged.
        uint256 timestamp; // The timestamp when the user wrote the journal.
    }

    Journal[] journals;

    /* 
     * This is an address => uint mapping, meaning and address can be associated with a number!
     * The address with the last time the user journalled will be stored.
    */
    mapping(address => uint256) public lastJournaledAt;

    constructor() payable {
        console.log("SMART CONTRACT HERE REPORTING FOR DUTY, WAGMI.");

        // Set the initial seed
        seed = (block.timestamp + block.difficulty) % 100;
    }

    // Logs the jounral logged by a users from the frontend.
    function journal(string memory _message) public {
    
        // Set the current timestamp at least  1440 minutes (24 hours) bigger than the last timestamp stored.
        require(
            // 1440 minutes
            lastJournaledAt[msg.sender] + 30 seconds < block.timestamp,
            "You have already journaled for the day. Comeback tomorrow to log your daily journal."
        );

        // Update the current timestamp for the user.
        lastJournaledAt[msg.sender] = block.timestamp;

        totalJournals += 1;
        console.log("%s has journaled!", msg.sender);
    
        // Stores the journal data in an array
        journals.push(Journal(msg.sender, _message, block.timestamp));

        // Generate a new seed for the next user that sends a journal
        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("Random # generated: %d", seed);

        // Give a 25% chance that the users wins the prize
        if (seed < 25) {
            console.log("%s won!", msg.sender);

            // Equal to $0.31
            uint256 prizeAmount = 0.0001 ether;

            require(
                prizeAmount <=address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require (success, "Failed to withdraw money from contract.");
            
        
        }   

        // Emits a new journal which can be seen on the client side of the Dapp.
        emit NewJournal(msg.sender, block.timestamp, _message);

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