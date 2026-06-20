// Add necessary events and modifiers if needed, ensuring imports are correct from the definition above.
// Note: In a real setup, we would define all functions precisely in one file.
// For this demonstration structure, we ensure the required state transition logic is present.

// Re-structuring for clarity based on standard Solidity practice (as the previous block was conceptual)
contract Escrow {
    enum JobStatus {
        PENDING,      // Job initiated, waiting for funding
        FUNDED,       // Funds received, awaiting completion work
        COMPLETED,    // Work verified and completed
        FAILED
    }

    struct Job {
        uint256 jobId;
        address payable payableTo; // The party receiving the funds (or contract)
        uint256 amount;            // Total amount agreed upon
        JobStatus status;          // Current stage of the funnel
        string description;       // Job details
    }

    mapping(uint256, Job) public jobs;
    uint256 public nextJobId = 1;

    event JobCreated(uint256 indexed jobId);
    event JobFunded(uint256 indexed jobId);
    event JobCompleted(uint256 indexed jobId);

    modifier onlyJobExists(uint256 _jobId) {
        require(jobs[_jobId].jobId != 0, "Job does not exist");
        _;
    }

    function initiateJob(address payable _payee, uint256 _amount, string memory _description) public payable {
        require(msg.value == _amount, "Amount mismatch");

        uint256 newJobId = nextJobId++;
        jobs[newJobId] = Job({
            jobId: newJobId,
            payableTo: _payee,
            amount: _amount,
            status: JobStatus.PENDING,
            description: _description
        });

        emit JobCreated(newJobId);
    }

    function fundJob(uint256 _jobId) public {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.PENDING, "Cannot fund a job that is not pending");

        jobs[_jobId].status = JobStatus.FUNDED;
        emit JobFunded(_jobId);
    }

    function completeJob(uint256 _jobId) public {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.FUNDED, "Cannot complete a job that is not funded");

        jobs[_jobId].status = JobStatus.COMPLETED;
        emit JobCompleted(_jobId);
    }

    function getJobStatus(uint256 _jobId) public view returns (JobStatus) {
        return jobs[_jobId].status;
    }
}