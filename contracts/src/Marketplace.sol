// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Marketplace {
    address public owner;

    struct Listing {
        uint256 id;
        string title;
        string category;
        uint256 price;
        address seller;
        bool isSold;
    }

    mapping(uint256, Listing) public listings;
    uint256 public nextListingId;

    event ListingCreated(uint256 id, string category, uint256 price);
    event ListingSold(uint256 id, address indexed buyer);

    constructor() {
        owner = msg.sender;
        nextListingId = 1;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    function createListing(
        string memory _title,
        string memory _category,
        uint256 _price
    ) public onlyOwner returns (uint256) {
        uint256 newId = nextListingId++;
        listings[newId] = Listing(
            newId,
            _title,
            _category,
            _price,
            msg.sender,
            false
        );
        emit ListingCreated(newId, _category, _price);
        return newId;
    }

    function buyListing(uint256 _listingId) public payable {
        require(_listingId > 0 && listings[_listingId].isSold == false, "Invalid listing");
        Listing storage listing = listings[_listingId];

        require(msg.value >= listing.price, "Insufficient payment");

        listing.isSold = true;

        emit ListingSold(_listingId, msg.sender);
    }

    function getListing(uint256 _listingId) public view returns (
        string memory title,
        string memory category,
        uint256 price,
        address seller,
        bool sold
    ) {
        Listing storage listing = listings[_listingId];
        return (
            listing.title,
            listing.category,
            listing.price,
            listing.seller,
            listing.isSold
        );
    }
}