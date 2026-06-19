// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Escrow
 * @notice A simplified escrow contract for managing deposits and conditional releases.
 */
contract Escrow is Ownable {
    struct EscrowItem {
        address payable recipient;
        uint256 amount;
        bool released;
    }

    mapping(address => mapping(uint256 => EscrowItem)) public escrowItems;
    uint256 public nextId;

    event FundsDeposited(address indexed user, uint256 amount);
    event FundsReleased(address indexed escrow, address indexed recipient, uint256 amount);

    /**
     * @notice Allows an address to deposit funds into the escrow.
     * @param _recipient The address to receive the funds.
     * @param _amount The amount to be escrowed.
     */
    function deposit(address payable _recipient, uint256 _amount) public {
        require(_amount > 0, "Deposit amount must be positive");
        escrowItems[nextId] = EscrowItem({
            recipient: _recipient,
            amount: _amount,
            released: false
        });
        nextId++;
        emit FundsDeposited(msg.sender, _amount);
    }

    /**
     * @notice Allows the owner to release funds for a specific escrow item.
     * @param _id The ID of the escrow item to release.
     */
    function releaseFunds(uint256 _id) public onlyOwner {
        require(_id > 0 && _id < nextId, "Invalid escrow ID");
        EscrowItem storage item = escrowItems[_id];

        require(!item.released, "Funds are already released");

        (bool success, ) = item.recipient.call{value: item.amount}("");
        require(success, "Transfer failed");

        item.released = true;
        emit FundsReleased(_id, item.recipient, item.amount);
    }

    /**
     * @notice Allows an escrow recipient to claim their funds (simulating a milestone).
     * In a real system, this would involve more complex conditional logic.
     * Here we simplify it: the owner can trigger the release if they deem it ready.
     * For this simple example, 'releaseFunds' is the core action authorized by ownership.
     */
}