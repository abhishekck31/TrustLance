// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ProjectNFT
 * @notice ERC721 NFT contract for tracking completed projects, incorporating a basic PoW linkage mechanism.
 */
contract ProjectNFT is ERC721, Ownable {
    // Mapping to store the status or proof associated with an NFT ID (Project ID)
    mapping(uint256 => bool) public isProjectCompleted;
    // Mapping to store the Proof-of-Work hash/metadata link
    mapping(uint256 => string) public projectProofHash;

    event ProjectCompleted(uint256 indexed projectId, address indexed owner);

    constructor(address initialOwner) ERC721("ProjectNFT", "PNFT") Ownable(initialOwner) {}

    /**
     * @notice Mints a new NFT representing a completed project.
     * @param tokenURI The metadata URI pointing to the project details.
     * @param proofHash The hash representing the Proof-of-Work completion state.
     */
    function mintProject(uint256 _projectId, string memory _tokenURI, string memory _proofHash) public onlyOwner {
        require(bytes(_proofHash).length > 0);

        _safeMint(msg.sender, _projectId);
        projectProofHash[_projectId] = _proofHash;
        isProjectCompleted[_projectId] = true;

        emit ProjectCompleted(_projectId, msg.sender);
    }

    /**
     * @notice Verifies if a specific project NFT is marked as completed.
     * @param _projectId The ID of the project to check.
     * @return bool True if the project is marked completed, false otherwise.
     */
    function checkCompletionStatus(uint256 _projectId) public view returns (bool) {
        return isProjectCompleted[_projectId];
    }

    /**
     * @notice Retrieves the Proof-of-Work hash for a project.
     * @param _projectId The ID of the project.
     * @return string The stored proof hash.
     */
    function getProofHash(uint256 _projectId) public view returns (string memory) {
        return projectProofHash[_projectId];
    }
}