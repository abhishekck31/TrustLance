// TrustLance: Activity Timeline Smart Contract
// Solidity ^0.8.20

pragma solidity ^0.8.20;

contract JobTimeline {
    struct JobStatus {
        uint256 createdTimestamp;
        uint256 fundedTimestamp;
        uint256 milestoneTimestamp;
        uint256 approvedTimestamp;
        uint256 releasedTimestamp;
    }

    struct JobRecord {
        uint256 jobId;
        address payable creator;
        string projectName;
        JobStatus status;
    }

    mapping(uint256, JobRecord) public jobs;
    uint256 nextJobId = 1;

    event JobCreated(uint256 indexed jobId, address indexed creator);
    event JobFunded(uint256 indexed jobId);
    event MilestoneSet(uint256 indexed jobId);
    event Approved(uint256 indexed jobId);
    event Released(uint256 indexed jobId);

    modifier onlyJobExists(uint256 _jobId) {
        require(jobs[_jobId].jobId != 0, "Job does not exist");
        _;
    }

    // --- Event Emitters (State Transitions) ---

    function createJob(string memory projectName) public returns (uint256) {
        uint256 newJobId = nextJobId++;
        jobs[newJobId] = JobRecord({
            jobId: newJobId,
            creator: payable(msg.sender),
            projectName: projectName,
            status: JobStatus({
                createdTimestamp: block.timestamp,
                fundedTimestamp: 0,
                milestoneTimestamp: 0,
                approvedTimestamp: 0,
                releasedTimestamp: 0
            })
        });
        emit JobCreated(newJobId, msg.sender);
        return newJobId;
    }

    function fundJob(uint256 _jobId) public {
        require(jobs[_jobId].jobId != 0 && jobs[_jobId].status.createdTimestamp != 0, "Invalid job ID or already processed");
        jobs[_jobId].status.fundedTimestamp = block.timestamp;
        emit JobFunded(_jobId);
    }

    function setMilestone(uint256 _jobId) public {
        require(jobs[_jobId].jobId != 0 && jobs[_jobId].status.fundedTimestamp > 0, "Job not funded");
        jobs[_jobId].status.milestoneTimestamp = block.timestamp;
        emit MilestoneSet(_jobId);
    }

    function approveJob(uint256 _jobId) public {
        require(jobs[_jobId].jobId != 0 && jobs[_jobId].status.milestoneTimestamp > 0, "Milestone not set");
        jobs[_jobId].status.approvedTimestamp = block.timestamp;
        emit Approved(_jobId);
    }

    function releaseJob(uint256 _jobId) public {
        require(jobs[_jobId].jobId != 0 && jobs[_jobId].status.approvedTimestamp > 0, "Job not approved");
        jobs[_jobId].status.releasedTimestamp = block.timestamp;
        emit Released(_jobId);
    }

    // --- View Functions ---

    function getJobTimeline(uint256 _jobId) public view returns (
        uint256 created,
        uint256 funded,
        uint256 milestone,
        uint256 approved,
        uint256 released
    ) {
        require(jobs[_jobId].jobId != 0, "Job does not exist");
        JobRecord storage job = jobs[_jobId];
        return (
            job.status.createdTimestamp,
            job.status.fundedTimestamp,
            job.status.milestoneTimestamp,
            job.status.approvedTimestamp,
            job.status.releasedTimestamp
        );
    }

    function getJobDetails(uint256 _jobId) public view returns (
        string memory projectName,
        address creator,
        uint256 createdTime,
        uint256 fundedTime,
        uint256 milestoneTime,
        uint256 approvedTime,
        uint256 releasedTime
    ) {
        require(jobs[_jobId].jobId != 0, "Job does not exist");
        JobRecord memory job = jobs[_jobId];
        return (
            job.projectName,
            job.creator,
            job.status.createdTimestamp,
            job.status.fundedTimestamp,
            job.status.milestoneTimestamp,
            job.status.approvedTimestamp,
            job.status.releasedTimestamp
        );
    }
}