// Escrow contract for managing Job -> Funded -> Completed workflows
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Escrow is Ownable {
    enum EscrowState {
        PENDING_FUNDING,
        FUNDED,
        COMPLETED,
        FAILED
    }

    struct Job {
        uint256 jobId;
        address payable funder;
        address payable executor;
        uint256 amount;
        EscrowState state;
    }

    mapping(uint256, Job) public jobs;
    uint256 public nextJobId = 1;

    event JobCreated(uint256 indexed jobId, address indexed funder, address indexed executor, uint256 amount);
    event Funded(uint256 indexed jobId);
    event Completed(uint256 indexed jobId);

    modifier onlyJobOwner(uint256 _jobId) {
        require(jobs[_jobId].funder == msg.sender || jobs[_jobId].executor == msg.sender, "Sender is not the funder or executor");
        _;
    }

    /**
     * @notice Initiates a new job escrow.
     * @param _amount The amount to be escrowed.
     * @param address_executor The address of the person hired to complete the job.
     */
    function createJob(uint256 _amount, address_executor) public payable {
        require(msg.value == _amount, "Sent amount does not match requested amount");

        uint256 newJobId = nextJobId++;
        jobs[newJobId] = Job({
            jobId: newJobId,
            funder: payable(msg.sender),
            executor: payable(address_executor),
            amount: _amount,
            state: EscrowState.PENDING_FUNDING
        });

        emit JobCreated(newJobId, msg.sender, address_executor, _amount);
    }

    /**
     * @notice Allows the funder to release funds upon job completion.
     * @param _jobId The ID of the job to fund.
     */
    function fundJob(uint256 _jobId) public {
        Job storage job = jobs[_jobId];
        require(job.state == EscrowState.PENDING_FUNDING, "Job is not in PENDING_FUNDING state");
        require(msg.sender == job.funder, "Only the funder can trigger funding release");

        jobs[_jobId].state = EscrowState.FUNDED;
        emit Funded(_jobId);
    }

    /**
     * @notice Allows the executor to mark the job as completed, triggering final release.
     * @param _jobId The ID of the job to complete.
     */
    function completeJob(uint256 _jobId) public {
        Job storage job = jobs[_jobId];
        require(job.state == EscrowState.FUNDED, "Job is not in FUNDED state");
        require(job.executor == msg.sender, "Only the executor can mark the job as completed");

        jobs[_jobId].state = EscrowState.COMPLETED;
        emit Completed(_jobId);
    }

    /**
     * @notice Allows the funder to withdraw funds upon successful completion.
     * @param _jobId The ID of the job to claim funds from.
     */
    function withdrawFunds(uint256 _jobId) public {
        Job storage job = jobs[_jobId];
        require(job.state == EscrowState.COMPLETED, "Job must be COMPLETED to withdraw");
        require(msg.sender == job.funder, "Only the funder can withdraw");

        // In a real scenario, this would call the ERC20 or native transfer mechanism.
        // For simplicity here, we assume Ether transfers handle the logic.
        (bool success, ) = payable(msg.sender).call{value: job.amount}(job.amount);
        require(success, "Transfer failed");

        // Cleanup (optional but good practice)
        delete jobs[_jobId];
    }

    /**
     * @notice Allows the executor to withdraw their share of the escrow amount.
     * @param _jobId The ID of the job to claim payment from.
     */
    function withdrawExecutorShare(uint256 _jobId) public {
        Job storage job = jobs[_jobId];
        require(job.state == EscrowState.COMPLETED, "Job must be COMPLETED to withdraw");
        require(job.executor == msg.sender, "Only the executor can withdraw");

        // Since this contract doesn't manage asset tokens directly, we assume the funder releases 100% here, 
        // or define a complex split if needed. For simplicity of conversion funnel, the full amount is released to the executor upon completion marker.
        (bool success, ) = payable(msg.sender).call{value: job.amount}(job.amount);
        require(success, "Transfer failed");

        // Cleanup
        delete jobs[_jobId];
    }
}