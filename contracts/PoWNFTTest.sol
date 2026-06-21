// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PoWNFT.sol";

contract PoWNFTTest {
    PoWNFT public immutable nftContract;

    PoWNFTTest() {
        nftContract = PoWNFT(address(PoWNFT));
    }

    // This function simulates the external work that results in a hash.
    function calculateProof(string memory projectData) public pure returns (uint256) {
        // A highly simplified, non-cryptographically secure mock hash for demonstration purposes.
        // In production, this would use actual cryptographic hashing (e.g., SHA256).
        uint256 hash = uint256(keccak256(abi.encodePacked(projectData, block.difficulty)));
        return hash;
    }

    // Example function demonstrating how a user might trigger the minting process
    function initiateMint(uint256 _projectId, string memory _details) public {
        PoWNFTFactory factory = PoWNFT(address(nftContract));
        factory.mintProofOfWorkNFT(_projectId, calculateProof(_details), _details);
    }
}