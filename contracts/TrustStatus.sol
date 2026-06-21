// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TrustStatus
 * @notice Manages the verification and security status for deployed smart contracts.
 * Implements the core logic for "Verified badges" and "Audit status markers".
 */
contract TrustStatus {
    // State variables mapping contract addresses to their trust status
    mapping(address => bool) public isVerified; // True if the contract has passed initial verification
    mapping(address => uint256) public auditScore; // A score or version indicating audit level
    mapping(address => string) public securityMarkers; // Store human-readable markers (e.g., "Audited", "Verified")

    // Events to log status changes
    event StatusUpdated(address indexed contractAddress, bool verified, uint256 newScore, string marker);

    /**
     * @notice Function to grant a verified badge to a contract.
     * @param _contractAddress The address of the smart contract being verified.
     * @param _score The audit score associated with this verification.
     */
    function grantVerification(address _contractAddress, uint256 _score) public {
        require(_contractAddress != address(0), "Invalid contract address");
        // In a real system, access control (e.g., only admin/auditor can call this) would be enforced here.
        isVerified[_contractAddress] = true;
        auditScore[_contractAddress] = _score;
        securityMarkers[_contractAddress] = "Verified: Score " string(abi.encodePacked(_score));

        emit StatusUpdated(_contractAddress, true, _score, securityMarkers[_contractAddress]);
    }

    /**
     * @notice Function to update the audit status of a contract.
     * @param _contractAddress The address of the smart contract.
     * @param _newScore The updated audit score.
     */
    function updateAuditStatus(address _contractAddress, uint256 _newScore) public {
        require(_contractAddress != address(0), "Invalid contract address");
        if (!isVerified[_contractAddress]) {
            revert("Contract is not yet verified.");
        }
        auditScore[_contractAddress] = _newScore;
        securityMarkers[_contractAddress] = "Audited: Score " string(abi.encodePacked(_newScore));

        emit StatusUpdated(_contractAddress, true, _newScore, securityMarkers[_contractAddress]);
    }

    /**
     * @notice Check if a specific contract has been verified.
     * @param _contractAddress The address to check.
     * @return True if the contract is verified, false otherwise.
     */
    function isContractVerified(address _contractAddress) public view returns (bool) {
        return isVerified[_contractAddress];
    }

    /**
     * @notice Retrieve the audit score for a contract.
     * @param _contractAddress The address of the smart contract.
     * @return The stored audit score.
     */
    function getAuditScore(address _contractAddress) public view returns (uint256) {
        require(_contractAddress != address(0), "Invalid contract address");
        return auditScore[_contractAddress];
    }

    /**
     * @notice Retrieve the security marker string for a contract.
     * @param _contractAddress The address of the smart contract.
     * @return The stored security marker.
     */
    function getSecurityMarker(address _contractAddress) public view returns (string) {
        require(_contractAddress != address(0), "Invalid contract address");
        return securityMarkers[_contractAddress];
    }
}