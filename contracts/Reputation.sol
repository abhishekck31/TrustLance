// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ReputationDecay
 * @notice Manages reputation scores and implements a time-based decay model.
 */
contract ReputationDecay is Ownable {
    // Struct to hold individual user reputation data
    struct UserReputation {
        uint256 score;
        uint256 lastUpdated;
        uint256 decayRate; // Decay rate applied per block or time unit
    }

    mapping(address => UserReputation) public reputations;

    // Event to log reputation changes
    event ReputationUpdated(address indexed user, uint256 newScore, uint256 timestamp);

    // State variables for decay configuration
    uint256 public constant DECAY_INTERVAL = 1 days; // Define the time unit for decay check
    uint256 public constant BASE_DECAY_RATE = 1000000000000; // Example base decay factor (e.g., points per day)

    /**
     * @notice Initializes a user's reputation score.
     * @param _user The address whose reputation is being set.
     * @param _initialScore The starting reputation value.
     * @param _decayRate The specific decay rate for this user.
     */
    function initializeReputation(address _user, uint256 _initialScore, uint256 _decayRate) public onlyOwner {
        require(_user != address(0), "Cannot initialize zero address");
        reputations[_user] = UserReputation({
            score: _initialScore,
            lastUpdated: block.timestamp,
            decayRate: _decayRate
        });
    }

    /**
     * @notice Grants reputation points to a user.
     * @dev This function simulates a gain (no decay applied immediately).
     * @param _user The address receiving the reputation.
     * @param _amount The amount of reputation to add.
     */
    function grantReputation(address _user, uint256 _amount) public onlyOwner {
        require(_user != address(0), "Cannot grant zero address");
        reputations[_user].score += _amount;
        reputations[_user].lastUpdated = block.timestamp;
        emit ReputationUpdated(_user, reputations[_user].score, reputations[_user].lastUpdated);
    }

    /**
     * @notice Penalizes a user by deducting reputation points.
     * @dev This function simulates a loss (no decay applied immediately).
     * @param _user The address being penalized.
     * @param _amount The amount of reputation to subtract.
     */
    function penalizeReputation(address _user, uint256 _amount) public onlyOwner {
        require(_user != address(0), "Cannot penalize zero address");
        reputations[_user].score -= _amount;
        reputations[_user].lastUpdated = block.timestamp;
        emit ReputationUpdated(_user, reputations[_user].score, reputations[_user].lastUpdated);
    }

    /**
     * @notice Calculates and applies reputation decay based on elapsed time since the last update.
     * @dev This is the core decay logic executed periodically or upon score access.
     * @param _user The address whose reputation is being decayed.
     */
    function applyDecay(address _user) public onlyOwner {
        require(reputations[_user].score > 0, "Reputation cannot be zero for decay calculation");

        uint256 timeElapsed = block.timestamp - reputations[_user].lastUpdated;

        // Calculate the total decay based on elapsed time and individual rate
        uint256 decayAmount = (timeElapsed / DECAY_INTERVAL) * reputations[_user].decayRate;

        if (decayAmount > 0) {
            uint256 newScore = reputations[_user].score - decayAmount;
            reputations[_user].score = newScore;
            reputations[_user].lastUpdated = block.timestamp; // Update timestamp to reflect the decay moment

            emit ReputationUpdated(_user, newScore, block.timestamp);
        }
    }

    /**
     * @notice Retrieves the current reputation score for a user.
     * @param _user The address to query.
     * @return The current reputation score.
     */
    function getReputation(address _user) public view returns (uint256) {
        return reputations[_user].score;
    }

    /**
     * @notice Retrieves the decay rate for a user.
     * @param _user The address to query.
     * @return The specific decay rate.
     */
    function getDecayRate(address _user) public view returns (uint256) {
        return reputations[_user].decayRate;
    }

    /**
     * @notice Allows the owner to manually trigger a decay calculation for all users.
     * @dev Useful for backfilling or periodic system maintenance.
     */
    function forceDecayAll() public onlyOwner {
        // In a real application, iterating over all addresses is computationally expensive and usually avoided.
        // For this example, we iterate over known stored reputation addresses (if manageable) or rely on batch updates.
        // Since mapping iteration is not directly supported in Solidity without a separate array/mapping of owned addresses,
        // we will rely on external off-chain orchestration or assume an oracle/manager calls applyDecay individually.
        // For simplicity within this scope, we leave this as a function placeholder unless the caller provides address lists.
    }
}