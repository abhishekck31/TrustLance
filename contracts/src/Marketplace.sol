// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Marketplace {
    address public owner;
    uint256 public nextListingId;

    // Events for tracking marketplace activity
    event ListingCreated(uint256 listingId, address indexed seller, string category);
    event ItemSold(uint256 listingId, address indexed buyer, uint256 price);

    struct Listing {
        uint256 id;
        string category;
        address seller;
        uint256 price;
        bool isSold;
    }

    mapping(uint256, Listing) public listings;

    event ListingUpdated(uint256 listingId, string newCategory);

    constructor() Ownable(msg.sender) {}

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function createListing(
        string memory category,
        uint256 price,
        address seller
    ) public onlyOwner returns (uint256) {
        uint256 newId = nextListingId++;
        listings[newId] = Listing(newId, category, seller, price, false);
        emit ListingCreated(newId, seller, category);
        return newId;
    }

    function sellItem(uint256 listingId, address buyer) public onlyOwner {
        require(listingId > 0 && listingId <= nextListingId, "Invalid listing ID");
        require(!listings[listingId].isSold, "Item already sold");

        uint256 price = listings[listingId].price;

        // In a real system, token transfer logic would happen here (ERC-721/ERC-20 interaction)

        listings[listingId].isSold = true;
        emit ItemSold(listingId, buyer, price);
    }

    function getListingDetails(uint256 listingId) public view returns (string memory category, address seller, uint256 price, bool sold) {
        Listing storage listing = listings[listingId];
        return tuple(listing.category, listing.seller, listing.price, listing.isSold);
    }
}