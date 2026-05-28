// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IEscrow {
    function resolveDispute(uint256 _jobId, bool _freelancerWon) external;
}

/**
 * @title TrustLanceGovernanceToken
 * @dev Governance token for the TrustLance ecosystem (Juror staking).
 */
contract TrustLanceGovernanceToken is ERC20, ERC20Burnable, Ownable {
    constructor() ERC20("TrustLance Governance", "TLG") Ownable(msg.sender) {
        _mint(msg.sender, 100000000 * 10 ** decimals()); // 100M supply
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

/**
 * @title TrustLanceDAO
 * @dev Dispute resolution DAO. Jurors stake TLG to vote on disputes.
 */
contract TrustLanceDAO is Ownable {
    TrustLanceGovernanceToken public token;
    IEscrow public escrow;

    uint256 public constant MIN_STAKE = 1000 * 10 ** 18;
    uint256 public constant SLASH_PERCENTAGE = 10; // 10%

    struct Dispute {
        uint256 jobId;
        uint256 votesFreelancer;
        uint256 votesClient;
        uint256 endTime;
        bool resolved;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => Dispute) public disputes;
    mapping(address => uint256) public stakedBalances;

    event Staked(address indexed juror, uint256 amount);
    event Unstaked(address indexed juror, uint256 amount);
    event Voted(uint256 indexed jobId, address indexed juror, bool votedForFreelancer);
    event DisputeResolved(uint256 indexed jobId, bool freelancerWon);
    event JurorSlashed(address indexed juror, uint256 amount);

    constructor(address _token, address _escrow) Ownable(msg.sender) {
        token = TrustLanceGovernanceToken(_token);
        escrow = IEscrow(_escrow);
    }

    function stake(uint256 amount) external {
        require(amount >= MIN_STAKE, "Insufficient stake");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        stakedBalances[msg.sender] += amount;
        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external {
        require(stakedBalances[msg.sender] >= amount, "Insufficient staked balance");
        stakedBalances[msg.sender] -= amount;
        require(token.transfer(msg.sender, amount), "Transfer failed");
        emit Unstaked(msg.sender, amount);
    }

    function startDispute(uint256 _jobId) external {
        // In a full implementation, Escrow would call this when dispute is raised.
        Dispute storage d = disputes[_jobId];
        require(d.endTime == 0, "Dispute already active");
        
        d.jobId = _jobId;
        d.endTime = block.timestamp + 3 days;
        d.resolved = false;
    }

    function vote(uint256 _jobId, bool _voteForFreelancer) external {
        require(stakedBalances[msg.sender] >= MIN_STAKE, "Must be an active juror");
        Dispute storage d = disputes[_jobId];
        require(block.timestamp < d.endTime, "Voting period ended");
        require(!d.hasVoted[msg.sender], "Already voted");

        d.hasVoted[msg.sender] = true;

        uint256 votingPower = stakedBalances[msg.sender];

        if (_voteForFreelancer) {
            d.votesFreelancer += votingPower;
        } else {
            d.votesClient += votingPower;
        }

        emit Voted(_jobId, msg.sender, _voteForFreelancer);
    }

    function resolveDispute(uint256 _jobId) external {
        Dispute storage d = disputes[_jobId];
        require(block.timestamp >= d.endTime, "Voting still active");
        require(!d.resolved, "Already resolved");

        d.resolved = true;
        bool freelancerWon = d.votesFreelancer > d.votesClient;

        // Call Escrow to resolve
        escrow.resolveDispute(_jobId, freelancerWon);

        // NOTE: Slashing logic for minority voters would go here.
        // E.g., iterating through a list of voters, checking if they voted against the majority,
        // and burning a portion of their staked balances.

        emit DisputeResolved(_jobId, freelancerWon);
    }
}
