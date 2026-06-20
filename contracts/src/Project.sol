// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Project {
    address public creator;
    string public title;
    string public description;
    uint256 public budget;
    uint256 public completed;
    bool public isPublished;

    event ProjectCreated(address indexed projectId, address indexed creator, string title);

    constructor(string memory _title, string memory _description, uint256 _budget) {
        title = _title;
        description = _description;
        budget = _budget;
        completed = 0;
        isPublished = false;
    }

    function markCompleted() public {
        completed = 1;
    }

    function publish() public {
        require(completed == 1, "Project must be completed before publishing");
        isPublished = true;
    }

    function getCreator() public view returns (address) {
        return creator;
    }
}