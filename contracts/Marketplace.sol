// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Marketplace {
    address public owner;

    struct Listing {
        uint256 id;
        string category;
        string title;
        uint256 price;
        address seller;
        bool isSold;
    }

    mapping(uint256, Listing) public listings;
    uint256 public nextListingId = 1;

    event ListingCreated(uint256 id, string category, string title, uint256 price);
    event ListingSold(uint256 id, address buyer);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createListing(
        string memory category,
        string memory title,
        uint256 price
    ) public {
        require(bytes(title).length > 0 && bytes(category).length > 0, "Title and category cannot be empty");

        uint256 newListingId = nextListingId++;
        listings[newListingId] = Listing(
            newListingId,
            category,
            title,
            price,
            msg.sender,
            false
        );

        emit ListingCreated(newListingId, category, title, price);
    }

    function sellListing(uint256 listingId) public {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Only the seller can sell this item");
        require(!listing.isSold, "Listing is already sold");

        listing.isSold = true;

        emit ListingSold(listingId, msg.sender);
    }

    function getListingDetails(uint256 listingId) public view returns (
        string memory category,
        string memory title,
        uint256 price,
        address seller,
        bool isSold
    ) {
        Listing storage listing = listings[listingId];
        return (
            listing.category,
            listing.title,
            listing.price,
            listing.seller,
            listing.isSold
        );
    }

    function getListingsByCategory(string memory category) public view returns (
        Listing[] memory
    ) {
        Listing[] memory filteredListings;
        for (uint256 i = 1; i < nextListingId; i++) {
            if (listings[i].category == category && !listings[i].isSold) {
                filteredListings.push(listings[i]);
            }
        }
        return filteredListings;
    }
}