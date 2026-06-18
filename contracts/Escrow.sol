// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Escrow
 * @notice A simple escrow contract managing funds and milestone releases.
 */
contract Escrow is Ownable {
    struct EscrowAgreement {
        address payable buyer;
        address payable seller;
        uint256 amount;
        uint256 releaseMilestone;
        bool released;
    }

    mapping(uint256, EscrowAgreement) public agreements;
    uint256 public nextAgreementId = 1;

    event FundsDeposited(uint256 agreementId, uint256 amount);
    event MilestoneReleased(uint256 agreementId, bool success);

    /**
     * @notice Creates a new escrow agreement and deposits the funds.
     * @param _seller The address of the party depositing the funds (usually the seller initially).
     * @param _buyer The address receiving the funds.
     * @param _amount The total amount to be held in escrow.
     * @param _milestone The milestone amount for release (if applicable, could be the full amount initially).
     */
    function createAgreement(
        address payable _seller,
        address payable _buyer,
        uint256 _amount,
        uint256 _milestone
    ) public {
        require(_seller != address(0) && _buyer != address(0), "Invalid addresses");
        require(_amount > 0, "Amount must be greater than zero");

        uint256 currentAgreementId = nextAgreementId++;

        agreements[currentAgreementId] = EscrowAgreement({
            buyer: _buyer,
            seller: _seller,
            amount: _amount,
            releaseMilestone: _milestone,
            released: false
        });

        // In a real system, ETH/ERC20 transfer logic would happen here.
        // For simplicity in this test script context, we assume the caller handles the actual transfer setup externally or via simulation.
        emit FundsDeposited(currentAgreementId, _amount);
    }

    /**
     * @notice Allows the seller to release the escrow funds based on a milestone.
     * @param _agreementId The ID of the agreement to release.
     * @param _success Whether the release is successful.
     */
    function releaseFunds(uint256 _agreementId, bool _success) public {
        require(_agreementId > 0 && _agreementId < nextAgreementId, "Invalid agreement ID");
        require(!agreements[_agreementId].released, "Agreement already released");

        if (_success) {
            agreements[_agreementId].released = true;
            emit MilestoneReleased(_agreementId, true);
        } else {
            // Revert or handle failure state if needed in a complex scenario.
            revert("Release failed");
        }
    }

    /**
     * @notice Owner can manage the contract (e.g., pause, admin actions).
     */
    function setOwner(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "Invalid owner");
        owner = _newOwner;
    }

    /**
     * @notice Retrieves details of an escrow agreement.
     */
    function getAgreementDetails(uint256 _agreementId) public view returns (
        address buyer,
        address seller,
        uint256 amount,
        uint256 releaseMilestone,
        bool released
    ) {
        require(_agreementId > 0 && _agreementId < nextAgreementId, "Invalid agreement ID");
        EscrowAgreement storage agreement = agreements[_agreementId];
        return (
            agreement.buyer,
            agreement.seller,
            agreement.amount,
            agreement.releaseMilestone,
            agreement.released
        );
    }
}