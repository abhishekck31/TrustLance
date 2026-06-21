// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PoWNFT
 * @notice Proof-of-Work NFT contract for completed projects.
 */
contract PoWNFT is ERC721, Ownable {

    struct ProjectProof {
        uint256 proofHash; // The hash resulting from the Proof-of-Work computation
        uint256 timestamp;
        string projectDetails;
    }

    mapping(uint256 => ProjectProof) public projectProofs;

    event NFTMinted(uint256 indexed tokenId, address indexed owner, uint256 proofHash);

    constructor() ERC721("ProofOfWorkNFT", "POWNFT") Ownable(msg.sender) {}

    /**
     * @notice Mints a new NFT requiring a Proof-of-Work computation.
     * @param _projectId The identifier for the project being minted.
     * @param _proofHash The calculated proof of work hash.
     * @param _details Additional metadata about the project.
     * @return tokenId The ID of the newly minted NFT.
     */
    function mintProofOfWorkNFT(
        uint256 _projectId,
        uint256 _proofHash,
        string memory _details
    ) public onlyOwner returns (uint256) {
        uint256 newTokenId = nextTokenId();
        _safeMint(msg.sender, newTokenId);

        projectProofs[newTokenId] = ProjectProof({
            proofHash: _proofHash,
            timestamp: block.timestamp,
            projectDetails: _details
        });

        emit NFTMinted(newTokenId, msg.sender, _proofHash);
        return newTokenId;
    }

    /**
     * @notice Retrieves the proof details for a specific token ID.
     */
    function getProof(uint256 tokenId) public view returns (uint256 proofHash, uint256 timestamp, string memory details) {
        require(projectProofs.exists(tokenId), "Project proof not found");
        ProjectProof storage proof = projectProofs[tokenId];
        return (proof.proofHash, proof.timestamp, proof.projectDetails);
    }

    // Function to simulate a difficulty check (optional, for advanced use)
    function verifyDifficulty(uint256 tokenId) public view returns (bool) {
        ProjectProof memory proof = projectProofs[tokenId];
        // In a real scenario, this would compare the actual PoW hash against a target.
        return proof.proofHash != 0; // Simple placeholder check
    }
}