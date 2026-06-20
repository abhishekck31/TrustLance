// Solidity smart contract for managing job favorites.
// In a real scenario, this would interact with an external Job registry.
pragma solidity ^0.8.20;

contract JobFavorites {
    struct Favorite {
        uint256 jobId;
        uint256 savedAt;
    }

    mapping(address => mapping(uint256 => bool)) public isFavorite;
    mapping(address => mapping(uint256 => Favorite)) public favorites;

    event JobFavorited(address indexed user, uint256 jobId);
    event JobUnfavorited(address indexed user, uint256 jobId);

    // Function to mark a job as favorite (requires external setup of jobs)
    function addFavorite(uint256 _jobId) public {
        require(address(msg.sender) != address(0), "Wallet must be connected");
        require(!isFavorite[msg.sender][_jobId], "Job already favorited");

        isFavorite[msg.sender][_jobId] = true;
        favorites[msg.sender][_jobId] = Favorite(_jobId, block.timestamp);

        emit JobFavorited(msg.sender, _jobId);
    }

    // Function to remove a job from favorites
    function removeFavorite(uint256 _jobId) public {
        require(isFavorite[msg.sender][_jobId], "Job is not favorited by this user");

        isFavorite[msg.sender][_jobId] = false;
        delete favorites[msg.sender][_jobId];

        emit JobUnfavorited(msg.sender, _jobId);
    }
}