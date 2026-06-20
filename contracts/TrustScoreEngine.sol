// TrustScoreEngine.sol
pragma solidity ^0.8.20;

/**
 * @title TrustScoreEngine
 * @notice A core contract defining the structure for reputation scoring.
 *         This contract manages the base scores and interaction tracking for entities.
 */
contract TrustScoreEngine {
    // Mapping from address to their current trust score.
    mapping(address => uint256) public trustScores;

    // Struct to hold details about specific interactions that contribute to the score.
    struct ReputationRecord {
        uint256 timestamp;
        string source; // e.g., "Transaction", "Approval", "GovernanceVote"
        int256 change;  // The delta applied to the score
        address counterparty;
    }

    // Mapping from address to their reputation history.
    mapping(address => ReputationRecord[]) public reputationHistory;

    event ScoreUpdated(address indexed user, uint256 newScore);
    event RecordAdded(address indexed user, string source, int256 change);

    /**
     * @dev Initializes the contract with a base score.
     * @param _user The address to initialize the score for.
     * @param initialScore The starting reputation value.
     */
    function initializeScore(address _user, uint256 _initialScore) public {
        require(address(this).balance > 0, "Engine not initialized"); // Simple check placeholder
        trustScores[_user] = _initialScore;
    }

    /**
     * @dev Records a specific reputation event.
     * @param _user The user whose score is being modified.
     * @param _source Description of the interaction type.
     * @param _change The amount to add or subtract from the score.
     * @param _counterparty The address involved in the transaction/event.
     */
    function recordReputationEvent(address _user, string memory _source, int256 _change, address _counterparty) public {
        // In a real system, access control (only the user or authorized entities can call this) would be crucial.
        require(trustScores[_user] > 0, "User score is zero or invalid");

        trustScores[_user] += uint256(_change);

        reputationHistory[_user].push(ReputationRecord({
            timestamp: block.timestamp,
            source: _source,
            change: int256(_change),
            counterparty: _counterparty
        }));

        emit RecordAdded(_user, _source, int256(_change));
    }

    /**
     * @dev Retrieves the current trust score for an address.
     * @param _user The address to query.
     * @return The current composite trust score.
     */
    function getTrustScore(address _user) public view returns (uint256) {
        return trustScores[_user];
    }

    /**
     * @dev Retrieves the history of reputation updates for an address.
     * @param _user The address to query.
     * @return Array of reputation records.
     */
    function getReputationHistory(address _user) public view returns (ReputationRecord[] memory) {
        return reputationHistory[_user];
    }
}