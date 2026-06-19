// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DisputeManager {
    struct Dispute {
        uint256 disputeId;
        address disputedBy;
        address assetOwner;
        uint256 amount;
        bool isFrozen;
        string disputeReason;
        uint256 timestamp;
    }

    mapping(uint256, Dispute) public disputes;
    uint256 public nextDisputeId = 1;

    event DisputeInitiated(uint256 disputeId, address indexed disputedBy);
    event FundsFrozen(uint256 disputeId, uint256 amount);

    // Tracks which token is being disputed (assuming a specific asset is involved)
    mapping(address => uint256) public frozenAssets;

    modifier onlyDisputed(uint256 _disputeId) {
        require(disputes[_disputeId].disputeId != 0, "Dispute does not exist");
        _;
    }

    /**
     * @notice Initiates a dispute and freezes the associated funds.
     * @param _assetOwner The address of the owner who initiated the dispute (or the asset holder).
     * @param _amount The amount to freeze.
     * @param _reason The reason for the dispute.
     */
    function initiateDispute(
        address _assetOwner,
        uint256 _amount,
        string memory _reason
    ) public {
        require(_amount > 0, "Amount must be positive");

        uint256 newDisputeId = nextDisputeId++;

        disputes[newDisputeId] = Dispute({
            disputeId: newDisputeId,
            disputedBy: msg.sender,
            assetOwner: _assetOwner,
            amount: _amount,
            isFrozen: true, // Immediately freeze upon initiation
            disputeReason: _reason,
            timestamp: block.timestamp
        });

        // In a real system, transfer logic to the freezing address would go here.
        emit DisputeInitiated(newDisputeId, msg.sender);
        emit FundsFrozen(newDisputeId, _amount);
    }

    /**
     * @notice Allows the asset owner to unfreeze funds if the dispute is resolved.
     * @param _disputeId The ID of the dispute to resolve.
     */
    function resolveDispute(uint256 _disputeId) public {
        require(disputes[_disputeId].disputedBy == msg.sender, "Only the disputer can resolve");
        require(disputes[_disputeId].isFrozen, "Dispute is already resolved or not frozen");

        disputes[_disputeId].isFrozen = false;
    }

    /**
     * @notice Checks if a specific asset is currently frozen via any dispute. (Simplified check)
     */
    function isAssetFrozen(address _assetOwner) public view returns (bool) {
        for (uint256 i = 1; i < nextDisputeId; i++) {
            if (disputes[i].assetOwner == _assetOwner && disputes[i].isFrozen) {
                return true;
            }
        }
        return false;
    }
}