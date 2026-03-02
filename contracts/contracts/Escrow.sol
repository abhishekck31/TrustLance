// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract Escrow is ReentrancyGuard, Pausable {

    // ================= EVENTS =================

    event JobCreated(
        uint256 indexed jobId,
        address indexed client,
        address indexed freelancer,
        uint256 totalAmount
    );

    event EscrowFunded(
        uint256 indexed jobId,
        address indexed client,
        uint256 amount
    );

    event MilestoneSubmitted(
        uint256 indexed jobId,
        uint256 indexed milestoneIndex,
        string submissionHash
    );

    event MilestoneApproved(
        uint256 indexed jobId,
        uint256 indexed milestoneIndex,
        uint256 amountReleased
    );

    event DisputeRaised(
        uint256 indexed jobId,
        address indexed raisedBy
    );

    event DisputeResolved(
        uint256 indexed jobId,
        bool freelancerWon
    );

    // ================= ENUMS =================

    enum JobStatus {
        Open,
        Funded,
        InProgress,
        Completed,
        Disputed,
        Resolved,
        Cancelled
    }

    enum MilestoneStatus {
        Pending,
        Submitted,
        Approved,
        Rejected
    }

    enum DisputeStatus {
        None,
        Raised,
        Voting,
        Resolved
    }

    // ================= STRUCTS =================

    struct Milestone {
        uint256 amount;
        MilestoneStatus status;
        string submissionHash;
    }

    struct Job {
        address client;
        address freelancer;
        uint256 totalAmount;
        uint256 releasedAmount;
        JobStatus status;
        DisputeStatus disputeStatus;
        string metadataHash;
        Milestone[] milestones;
    }

    // ================= STORAGE =================

    mapping(uint256 => Job) public jobs;
    uint256 public jobCounter;
    address public resolver;
    address public owner;

    // ================= MODIFIERS =================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // ================= FUNCTIONS =================

    constructor() {
        owner = msg.sender;
        resolver = msg.sender;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function createJob(
        address _freelancer,
        string calldata _metadataHash,
        uint256[] calldata _milestoneAmounts
    ) external {

        require(_freelancer != address(0), "Invalid freelancer");
        require(_freelancer != msg.sender, "Client cannot be freelancer");
        require(_milestoneAmounts.length > 0, "At least one milestone required");

        uint256 total;

        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            require(_milestoneAmounts[i] > 0, "Milestone amount must be greater than zero");
            total += _milestoneAmounts[i];
        }

        uint256 jobId = jobCounter;

        Job storage newJob = jobs[jobId];

        newJob.client = msg.sender;
        newJob.freelancer = _freelancer;
        newJob.totalAmount = total;
        newJob.releasedAmount = 0;
        newJob.status = JobStatus.Open;
        newJob.disputeStatus = DisputeStatus.None;
        newJob.metadataHash = _metadataHash;

        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            newJob.milestones.push(
                Milestone({
                    amount: _milestoneAmounts[i],
                    status: MilestoneStatus.Pending,
                    submissionHash: ""
                })
            );
        }

        jobCounter++;

        emit JobCreated(jobId, msg.sender, _freelancer, total);
    }

    function fundEscrow(uint256 _jobId) external payable nonReentrant whenNotPaused {

        Job storage job = jobs[_jobId];

        require(job.client != address(0), "Job does not exist");
        require(msg.sender == job.client, "Only client can fund");
        require(job.status == JobStatus.Open, "Job not open for funding");
        require(msg.value == job.totalAmount, "Incorrect funding amount");

        job.status = JobStatus.Funded;

        emit EscrowFunded(_jobId, msg.sender, msg.value);
    }

    function submitMilestone(
        uint256 _jobId,
        uint256 _milestoneIndex,
        string calldata _submissionHash
    ) external {
        Job storage job = jobs[_jobId];

        require(job.client != address(0), "Job does not exist");
        require(msg.sender == job.freelancer, "Only freelancer can submit");
        require(
            job.status == JobStatus.Funded || job.status == JobStatus.InProgress,
            "Job not active"
        );
        require(
            _milestoneIndex < job.milestones.length,
            "Invalid milestone index"
        );
        require(
            bytes(_submissionHash).length > 0,
            "Submission hash cannot be empty"
        );

        Milestone storage milestone = job.milestones[_milestoneIndex];

        require(
            milestone.status == MilestoneStatus.Pending,
            "Milestone not pending"
        );

        milestone.submissionHash = _submissionHash;
        milestone.status = MilestoneStatus.Submitted;

        if (job.status == JobStatus.Funded) {
            job.status = JobStatus.InProgress;
        }

        emit MilestoneSubmitted(_jobId, _milestoneIndex, _submissionHash);
    }

    function approveMilestone(
        uint256 _jobId,
        uint256 _milestoneIndex
    ) external nonReentrant whenNotPaused {
        Job storage job = jobs[_jobId];

        require(job.client != address(0), "Job does not exist");
        require(msg.sender == job.client, "Only client can approve");
        require(job.status != JobStatus.Disputed, "Job under dispute");
        require(job.status == JobStatus.InProgress, "Job not active");
        require(_milestoneIndex < job.milestones.length, "Invalid milestone index");

        Milestone storage milestone = job.milestones[_milestoneIndex];

        require(milestone.status == MilestoneStatus.Submitted, "Milestone not submitted");

        uint256 amount = milestone.amount;

        require(address(this).balance >= amount, "Insufficient contract balance");

        milestone.status = MilestoneStatus.Approved;

        job.releasedAmount += amount;

        (bool success, ) = payable(job.freelancer).call{value: amount}("");
        require(success, "Transfer failed");

        emit MilestoneApproved(_jobId, _milestoneIndex, amount);

        // Check if all milestones are approved
        bool allApproved = true;
        for (uint256 i = 0; i < job.milestones.length; i++) {
            if (job.milestones[i].status != MilestoneStatus.Approved) {
                allApproved = false;
                break;
            }
        }

        if (allApproved) {
            job.status = JobStatus.Completed;
        }
    }

    function raiseDispute(uint256 _jobId) external {
        Job storage job = jobs[_jobId];

        require(job.client != address(0), "Job does not exist");
        require(
            msg.sender == job.client || msg.sender == job.freelancer,
            "Not authorized"
        );
        require(job.status != JobStatus.Completed, "Job already completed");
        require(job.status != JobStatus.Disputed, "Already disputed");

        job.status = JobStatus.Disputed;
        job.disputeStatus = DisputeStatus.Raised;

        emit DisputeRaised(_jobId, msg.sender);
    }

    function resolveDispute(
        uint256 _jobId,
        bool _freelancerWon
    ) external nonReentrant whenNotPaused {

        require(msg.sender == resolver, "Only resolver allowed");

        Job storage job = jobs[_jobId];

        require(job.status == JobStatus.Disputed, "Job not disputed");
        require(job.disputeStatus == DisputeStatus.Raised, "Already resolved");

        job.disputeStatus = DisputeStatus.Resolved;
        job.status = JobStatus.Resolved;

        uint256 remaining = job.totalAmount - job.releasedAmount;

        if (remaining > 0) {
            if (_freelancerWon) {
                (bool success, ) = payable(job.freelancer).call{value: remaining}("");
                require(success, "Transfer failed");
            } else {
                (bool success, ) = payable(job.client).call{value: remaining}("");
                require(success, "Transfer failed");
            }
        }

        emit DisputeResolved(_jobId, _freelancerWon);
    }

    // ================= VIEW HELPERS =================

    function getMilestoneCount(uint256 _jobId) external view returns (uint256) {
        return jobs[_jobId].milestones.length;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
