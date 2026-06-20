// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FreelancerRegistry {
    struct Freelancer {
        uint256 id;
        string name;
        string skillSet; // Stored as a comma-separated string for simplicity in this example, real world would use arrays/mappings of skills
        address owner;
    }

    struct Job {
        uint256 id;
        string title;
        string description;
        uint256 requiredSkillsHash; // Hash or identifier for the required skill set
        bool isCompleted;
    }

    mapping(uint256 => Freelancer) public freelancers;
    mapping(uint256 => Job) public jobs;
    uint256 public nextFreelancerId = 1;
    uint256 public nextJobId = 1;

    event FreelancerRegistered(uint256 indexed id, string name, string skillSet);
    event JobPosted(uint256 indexed id, string title, uint256 requiredSkillsHash);

    // --- Freelancer Functions ---
    function registerFreelancer(string memory _name, string memory _skillSet) public {
        uint256 newId = nextFreelancerId++;
        freelancers[newId] = Freelancer(
            newId,
            _name,
            _skillSet,
            msg.sender
        );
        emit FreelancerRegistered(newId, _name, _skillSet);
    }

    function getFreelancer(uint256 _id) public view returns (
        string memory name,
        string memory skillSet,
        address owner
    ) {
        Freelancer storage f = freelancers[_id];
        return (f.name, f.skillSet, f.owner);
    }

    // --- Job Functions ---
    function postJob(string memory _title, string memory _description, uint256 _requiredSkillsHash) public {
        uint256 newId = nextJobId++;
        jobs[newId] = Job(
            newId,
            _title,
            _description,
            _requiredSkillsHash,
            false
        );
        emit JobPosted(newId, _title, _requiredSkillsHash);
    }

    function getJob(uint256 _id) public view returns (
        string memory title,
        string memory description,
        uint256 requiredSkillsHash,
        bool isCompleted
    ) {
        Job storage j = jobs[_id];
        return (j.title, j.description, j.requiredSkillsHash, j.isCompleted);
    }
}