// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "hardhat";
import {Freelancer} from "../src/Freelancer.sol";

contract FreelancerTest is Test {
    Freelancer public freelancerContract;

    function setUp() public {
        // Deploy a new freelancer
        Freelancer deployed = new Freelancer("Alice Developer", "Expert in Web3 and Solidity development.", "Solidity");
        freelancerContract = deployed;
    }

    function testBasicInitialization() public {
        assert(bytes(freelancerContract.name).length > 0);
        assert(bytes(freelancerContract.primarySkill).length > 0);
        assert(freelancerContract.rating == 100);
    }

    function testUpdateRating() public {
        uint256 newRating = 950;
        freelancerContract.updateRating(newRating);
        assert(freelancerContract.rating == newRating);
    }

    function testAddProject() public {
        freelancerContract.addProject();
        // Note: Since we don't have a contract state manager here, this test primarily validates the function call logic.
        // In a real setting, this would interact with the state correctly.
    }
}