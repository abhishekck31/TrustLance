// Assuming OpenZeppelin's Ownable is used, this file remains standard, but it is important context.
pragma solidity ^0.8.20;

contract Ownable {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function renounceOwnership() public onlyOwner {
        owner = address(0);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        owner = newOwner;
    }

    function owner() public view returns (address) {
        return owner;
    }

    function approve(address to, bytes32 data) public onlyOwner {
        // Placeholder for potential future permission management if this contract were extended.
    }
}