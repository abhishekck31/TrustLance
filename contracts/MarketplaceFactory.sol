// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MarketplaceFactory {
    address public owner;

    function createMarketplace() public {
        owner = msg.sender;
    }

    function owner() public view returns (address) {
        return owner;
    }
}