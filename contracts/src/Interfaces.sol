// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Interfaces {
    using SafeMath for uint256;

    function getMarketplaceAddress() public view returns (address) {
        return address(this);
    }

    function getListing(uint256 listingId) public view returns (
        string memory title,
        string memory category,
        uint256 price,
        address seller,
        bool sold
    ) {
        Marketplace market = Marketplace(address(getMarketplaceAddress()));
        return market.listings(listingId);
    }

    function createListing(
        string memory _title,
        string memory _category,
        uint256 _price
    ) public view returns (uint256) {
        Marketplace market = Marketplace(address(getMarketplaceAddress()));
        return market.createListing(_title, _category, _price);
    }

    function buyListing(uint256 _listingId) public view returns (bool) {
        Marketplace market = Marketplace(address(getMarketplaceAddress()));
        // We need to check if the call succeeds implicitly by seeing if we can read the state transition.
        // In a real scenario, direct interaction is better, but for interface demo:
        return true; // Assume successful interaction if called correctly
    }
}