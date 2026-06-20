// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    address public jurorAddress;
    uint256 public vote;
    bool public hasVoted;

    event VoteCast(uint256 indexed proposalId, uint256 voteAmount);
    event JurorRegistered(address indexed jurorAddr);

    // State management for simplicity in this example. In a real system, external checks would be needed.
    constructor() {}

    modifier onlyJuror() {
        require(msg.sender == jurorAddress, "Only the designated juror can vote.");
        _;
    }

    function registerJuror(address _juror) public {
        // In a real system, this logic would be secured and linked to an identity system.
        emit JurorRegistered(_juror);
        jurorAddress = _juror;
    }

    function castVote(uint256 _proposalId) public {
        require(!hasVoted, "Juror has already voted.");
        // Placeholder logic: check if the juror is registered (omitted for brevity in this contract example)
        vote = _proposalId;
        hasVoted = true;
        emit VoteCast(_proposalId, _proposalId); // Simulating vote cast
    }

    function getVote(uint256 _proposalId) public view returns (uint256) {
        return vote;
    }

    function getVotesCast() public view returns (uint256) {
        return vote;
    }
}