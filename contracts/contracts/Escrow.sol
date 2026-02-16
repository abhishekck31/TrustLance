// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {

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

    // ================= FUNCTIONS =================

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

    function fundEscrow(uint256 _jobId) external payable {

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
    ) external {
        Job storage job = jobs[_jobId];

        require(job.client != address(0), "Job does not exist");
        require(msg.sender == job.client, "Only client can approve");
        require(job.status == JobStatus.InProgress, "Job not active");
        require(_milestoneIndex < job.milestones.length, "Invalid milestone index");

        Milestone storage milestone = job.milestones[_milestoneIndex];

        require(milestone.status == MilestoneStatus.Submitted, "Milestone not submitted");

        uint256 amount = milestone.amount;

        require(address(this).balance >= amount, "Insufficient contract balance");

        milestone.status = MilestoneStatus.Approved;

        job.releasedAmount += amount;

        payable(job.freelancer).transfer(amount);

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

    // ================= VIEW HELPERS =================

    function getMilestoneCount(uint256 _jobId) external view returns (uint256) {
        return jobs[_jobId].milestones.length;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
