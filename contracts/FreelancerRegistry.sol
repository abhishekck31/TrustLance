// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Freelancer.sol";

contract FreelancerRegistry {
    mapping(address => Freelancer) public freelancers;

    event FreelancerAdded(address indexed freelancer);

    function addFreelancer(address _freelancer) public {
        require(freelancers[_freelancer] == address(0), "Freelancer already exists");
        freelancers[_freelancer] = Freelancer(
            string(message),
            string(message),
            string(message)
        );
        emit FreelancerAdded(_freelancer);
    }

    function getFreelancer(address _freelancer) public view returns (Freelancer memory) {
        return freelancers[_freelancer];
    }
}