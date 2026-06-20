// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CategoryItem is ERC721, Ownable {
    // Mapping to store which marketplace item belongs to this category (for easier retrieval if needed)
    mapping(uint256 => uint256) public itemIdToListingId;

    event ItemAdded(uint256 tokenId);

    constructor(address _owner) ERC721("MarketplaceItems", "MPItem") Ownable(msg.sender) {}

    function addListing(uint256 listingId, address itemTokenId) public onlyOwner {
        require(listingId > 0, "Invalid listing ID");
        _safeMint(msg.sender, itemTokenId); // Seller receives the NFT representation of the sale/item
        itemIdToListingId[itemTokenId] = listingId;
        emit ItemAdded(itemTokenId);
    }

    function getListingId(uint256 tokenId) public view returns (uint256) {
        return itemIdToListingId[tokenId];
    }
}