// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TransactionManager is Ownable {
    enum TxState {
        AWAITING_SIGNATURE,
        SENT,
        CONFIRMING,
        COMPLETED
    }

    struct Transaction {
        uint256 txId;
        address payable recipient;
        TxState state;
        uint256 timestamp;
    }

    mapping(uint256, Transaction) public transactions;
    uint256 public nextTxId;

    event TransactionStateUpdated(uint256 indexed txId, TxState newState);

    modifier onlyTxOwner(uint256 _txId) {
        require(msg.sender == owner(), "Only owner can manage this transaction state");
    }

    constructor() {
        nextTxId = 1;
    }

    function createTransaction(address payable _recipient) public returns (uint256) {
        uint256 newTxId = nextTxId++;
        transactions[newTxId] = Transaction({
            txId: newTxId,
            recipient: _recipient,
            state: TxState.AWAITING_SIGNATURE,
            timestamp: block.timestamp
        });
        emit TransactionStateUpdated(newTxId, TxState.AWAITING_SIGNATURE);
        return newTxId;
    }

    function updateTransactionState(uint256 _txId, TxState _newState) public onlyTxOwner {
        require(_txId > 0 && _txId < nextTxId, "Invalid transaction ID");
        Transaction storage tx = transactions[_txId];
        require(tx.state != _newState, "State already updated");

        tx.state = _newState;
        tx.timestamp = block.timestamp;
        emit TransactionStateUpdated(_txId, _newState);
    }

    function getTransactionState(uint256 _txId) public view returns (TxState) {
        Transaction memory tx = transactions[_txId];
        return tx.state;
    }

    // Note: In a real system, funds transfer and confirmation logic would be heavily integrated here, perhaps triggering events on the backend.
}