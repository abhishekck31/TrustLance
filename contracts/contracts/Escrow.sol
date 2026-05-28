// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract Escrow is ReentrancyGuard, Pausable {

    // ================= EVENTS =================

    event JobCreated(uint256 indexed jobId, address indexed client, address indexed freelancer, uint256 totalAmount);
    event JobCancelled(uint256 indexed jobId);
    event EscrowFunded(uint256 indexed jobId, address indexed client, uint256 amount);
    event MilestoneSubmitted(uint256 indexed jobId, uint256 indexed milestoneIndex, string submissionHash);
    event MilestoneApproved(uint256 indexed jobId, uint256 indexed milestoneIndex, uint256 amountReleased);
    event MilestoneRejected(uint256 indexed jobId, uint256 indexed milestoneIndex);
    event DisputeRaised(uint256 indexed jobId, address indexed raisedBy);
    event DisputeResolved(uint256 indexed jobId, bool freelancerWon);
    event Withdrawn(address indexed user, uint256 amount);
    event ResolverUpdated(address indexed oldResolver, address indexed newResolver);

    // ================= ENUMS =================

    enum JobStatus { Open, Funded, InProgress, Completed, Disputed, Resolved, Cancelled }
    enum MilestoneStatus { Pending, Submitted, Approved, Rejected }
    enum DisputeStatus { None, Raised, Resolved }

    // ================= STRUCTS =================

    struct Milestone {
        uint96 amount;
        MilestoneStatus status;
        uint32 submittedAt;
        uint32 approvedAt;
        string submissionHash;
    }

    struct Job {
        address client;
        uint96 totalAmount;
        address freelancer;
        uint96 releasedAmount;
        uint16 milestoneCount;
        uint16 completedMilestones;
        JobStatus status;
        DisputeStatus disputeStatus;
        uint32 createdAt;
        uint32 updatedAt;
        string metadataHash;
        Milestone[] milestones;
    }

    // ================= STORAGE =================

    mapping(uint256 => Job) public jobs;
    mapping(address => uint256) public balances; // Pull-over-Push withdrawal pattern

    uint256 public jobCounter;
    address public resolver;
    address public owner;

    // ================= MODIFIERS =================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyClient(uint256 _jobId) {
        require(msg.sender == jobs[_jobId].client, "Only client");
        _;
    }

    modifier onlyFreelancer(uint256 _jobId) {
        require(msg.sender == jobs[_jobId].freelancer, "Only freelancer");
        _;
    }

    modifier jobExists(uint256 _jobId) {
        require(jobs[_jobId].client != address(0), "Job does not exist");
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

    function updateResolver(address _newResolver) external onlyOwner {
        require(_newResolver != address(0), "Invalid address");
        address oldResolver = resolver;
        resolver = _newResolver;
        emit ResolverUpdated(oldResolver, _newResolver);
    }

    function createJob(
        address _freelancer,
        string calldata _metadataHash,
        uint96[] calldata _milestoneAmounts
    ) external {
        require(_freelancer != address(0), "Invalid freelancer");
        require(_freelancer != msg.sender, "Client cannot be freelancer");
        require(_milestoneAmounts.length > 0, "At least one milestone required");
        require(_milestoneAmounts.length <= type(uint16).max, "Too many milestones");

        uint96 total = 0;
        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            require(_milestoneAmounts[i] > 0, "Milestone amount must be > 0");
            total += _milestoneAmounts[i];
        }

        uint256 jobId = jobCounter;
        Job storage newJob = jobs[jobId];

        newJob.client = msg.sender;
        newJob.freelancer = _freelancer;
        newJob.totalAmount = total;
        newJob.releasedAmount = 0;
        newJob.milestoneCount = uint16(_milestoneAmounts.length);
        newJob.completedMilestones = 0;
        newJob.status = JobStatus.Open;
        newJob.disputeStatus = DisputeStatus.None;
        newJob.createdAt = uint32(block.timestamp);
        newJob.updatedAt = uint32(block.timestamp);
        newJob.metadataHash = _metadataHash;

        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            newJob.milestones.push(Milestone({
                amount: _milestoneAmounts[i],
                status: MilestoneStatus.Pending,
                submittedAt: 0,
                approvedAt: 0,
                submissionHash: ""
            }));
        }

        jobCounter++;
        emit JobCreated(jobId, msg.sender, _freelancer, total);
    }

    function cancelJob(uint256 _jobId) external jobExists(_jobId) onlyClient(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Open, "Cannot cancel now");
        
        job.status = JobStatus.Cancelled;
        job.updatedAt = uint32(block.timestamp);

        emit JobCancelled(_jobId);
    }

    function fundEscrow(uint256 _jobId) external payable nonReentrant whenNotPaused jobExists(_jobId) onlyClient(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Open, "Job not open for funding");
        require(msg.value == job.totalAmount, "Incorrect funding amount");

        job.status = JobStatus.Funded;
        job.updatedAt = uint32(block.timestamp);

        emit EscrowFunded(_jobId, msg.sender, msg.value);
    }

    function submitMilestone(
        uint256 _jobId,
        uint256 _milestoneIndex,
        string calldata _submissionHash
    ) external jobExists(_jobId) onlyFreelancer(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Funded || job.status == JobStatus.InProgress, "Job not active");
        require(_milestoneIndex < job.milestoneCount, "Invalid milestone index");
        require(bytes(_submissionHash).length > 0, "Hash cannot be empty");

        Milestone storage milestone = job.milestones[_milestoneIndex];
        require(milestone.status == MilestoneStatus.Pending || milestone.status == MilestoneStatus.Rejected, "Cannot submit");

        milestone.submissionHash = _submissionHash;
        milestone.status = MilestoneStatus.Submitted;
        milestone.submittedAt = uint32(block.timestamp);

        if (job.status == JobStatus.Funded) {
            job.status = JobStatus.InProgress;
        }
        job.updatedAt = uint32(block.timestamp);

        emit MilestoneSubmitted(_jobId, _milestoneIndex, _submissionHash);
    }

    function approveMilestone(
        uint256 _jobId,
        uint256 _milestoneIndex
    ) external nonReentrant whenNotPaused jobExists(_jobId) onlyClient(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.InProgress, "Job not active");
        require(job.disputeStatus == DisputeStatus.None, "Job under dispute");
        require(_milestoneIndex < job.milestoneCount, "Invalid milestone index");

        Milestone storage milestone = job.milestones[_milestoneIndex];
        require(milestone.status == MilestoneStatus.Submitted, "Milestone not submitted");

        uint96 amount = milestone.amount;
        milestone.status = MilestoneStatus.Approved;
        milestone.approvedAt = uint32(block.timestamp);

        job.releasedAmount += amount;
        job.completedMilestones += 1;
        job.updatedAt = uint32(block.timestamp);

        // Pull over Push pattern
        balances[job.freelancer] += amount;

        emit MilestoneApproved(_jobId, _milestoneIndex, amount);

        // O(1) completion detection
        if (job.completedMilestones == job.milestoneCount) {
            job.status = JobStatus.Completed;
        }
    }

    function rejectMilestone(
        uint256 _jobId,
        uint256 _milestoneIndex
    ) external jobExists(_jobId) onlyClient(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.InProgress, "Job not active");
        require(job.disputeStatus == DisputeStatus.None, "Job under dispute");
        require(_milestoneIndex < job.milestoneCount, "Invalid milestone index");

        Milestone storage milestone = job.milestones[_milestoneIndex];
        require(milestone.status == MilestoneStatus.Submitted, "Milestone not submitted");

        milestone.status = MilestoneStatus.Rejected;
        job.updatedAt = uint32(block.timestamp);

        emit MilestoneRejected(_jobId, _milestoneIndex);
    }

    function raiseDispute(uint256 _jobId) external jobExists(_jobId) {
        Job storage job = jobs[_jobId];
        require(msg.sender == job.client || msg.sender == job.freelancer, "Not authorized");
        require(job.status == JobStatus.Funded || job.status == JobStatus.InProgress, "Cannot dispute in current state");
        require(job.disputeStatus == DisputeStatus.None, "Already disputed");

        job.status = JobStatus.Disputed;
        job.disputeStatus = DisputeStatus.Raised;
        job.updatedAt = uint32(block.timestamp);

        emit DisputeRaised(_jobId, msg.sender);
    }

    function resolveDispute(
        uint256 _jobId,
        bool _freelancerWon
    ) external nonReentrant whenNotPaused jobExists(_jobId) {
        require(msg.sender == resolver, "Only resolver");
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Disputed && job.disputeStatus == DisputeStatus.Raised, "Not disputable");

        job.disputeStatus = DisputeStatus.Resolved;
        job.status = JobStatus.Resolved;
        job.updatedAt = uint32(block.timestamp);

        uint96 remaining = job.totalAmount - job.releasedAmount;
        if (remaining > 0) {
            job.releasedAmount += remaining;
            if (_freelancerWon) {
                balances[job.freelancer] += remaining;
            } else {
                balances[job.client] += remaining;
            }
        }

        emit DisputeResolved(_jobId, _freelancerWon);
    }

    function withdraw() external nonReentrant {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No funds");
        balances[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit Withdrawn(msg.sender, amount);
    }

    function emergencyWithdraw() external onlyOwner whenPaused {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Transfer failed");
    }

    // ================= VIEW HELPERS =================

    function getMilestone(uint256 _jobId, uint256 _index) external view returns (Milestone memory) {
        return jobs[_jobId].milestones[_index];
    }
}
