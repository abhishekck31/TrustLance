// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title ReputationDecay
 * @notice Manages user reputation scores with a decay mechanism.
 */
contract ReputationDecay {
    address public owner;
    mapping(address => uint256) public reputationScores;
    
    // Decay parameters
    uint256 public DECAY_RATE = 1000; // Decay in base units (e.g., points per block/time unit)

    event ScoreUpdated(address indexed user, uint256 newScore, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    /**
     * @notice Initializes a user's reputation score.
     * @param _user The address of the user.
     * @param _initialScore The starting reputation value.
     */
    function initializeReputation(address _user, uint256 _initialScore) public onlyOwner {
        reputationScores[_user] = _initialScore;
    }

    /**
     * @notice Allows users to accumulate reputation points (gaining reputation).
     * This is the reward mechanism.
     * @param _user The user gaining reputation.
     * @param _points The amount of points gained.
     */
    function gainReputation(address _user, uint256 _points) public {
        // In a real scenario, this would interact with an Oracle or Keeper to determine time elapsed for accurate decay calculation.
        reputationScores[_user] = reputationScores[_user] + _points;
        emit ScoreUpdated(_user, reputationScores[_user], block.timestamp);
    }

    /**
     * @notice Calculates and applies the reputation decay based on the time elapsed since the last update.
     * For simplicity in this example, we apply a simple linear decay factor based on current block timestamp.
     * NOTE: In production, complex time-based calculations require accurate external timestamps (like Chainlink or Time APIs).
     */
    function applyDecay() public onlyOwner {
        uint256 currentTimestamp = uint256(block.timestamp);

        for (address userAddress in reputationScores.keys) {
            if (reputationScores[userAddress] > 0) {
                // Calculate elapsed time since the last reported update or since epoch for decay calculation
                uint256 timeElapsed = currentTimestamp - uint256(block.timestamp); // This is effectively zero in a single execution context unless using historical data storage.
                
                // Simplified Decay: Apply decay proportional to accumulated time (simulating passage of time)
                uint256 decayAmount = (reputationScores[userAddress] * DECAY_RATE) / 1000; // Scale factor adjustment

                reputationScores[userAddress] -= decayAmount;
                
                // Ensure score doesn't go negative
                if (reputationScores[userAddress] < 0) {
                    reputationScores[userAddress] = 0;
                }
            }
        }
    }

    /**
     * @notice Retrieves the current reputation score for a given address.
     * @param _user The address whose score is requested.
     * @return The current reputation score.
     */
    function getReputation(address _user) public view returns (uint256) {
        return reputationScores[_user];
    }

    /**
     * @notice Allows the owner to adjust the global decay rate.
     * @param _newRate The new decay rate multiplier.
     */
    function setDecayRate(uint256 _newRate) public onlyOwner {
        DECAY_RATE = _newRate;
    }
}