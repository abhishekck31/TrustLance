// Define the structure for a Freelancer Profile stored on-chain
pragma solidity ^0.8.20;

contract FreelancerProfile {
    struct Profile {
        address freelancerAddress;
        string bio;
        uint256 rating;
        string websiteUrl; // Shareable URL hint
    }

    mapping(address => Profile) public profiles;

    event ProfileUpdated(address indexed freelancer, string newBio);

    function setProfile(
        string memory _bio,
        uint256 _rating,
        string memory _websiteUrl
    ) public {
        require(profiles[msg.sender].freelancerAddress == msg.sender, "Caller is not a freelancer");
        profiles[msg.sender].bio = _bio;
        profiles[msg.sender].rating = _rating;
        profiles[msg.sender].websiteUrl = _websiteUrl;
        emit ProfileUpdated(msg.sender, _bio);
    }

    function getProfile(address _freelancer) public view returns (
        string memory bio,
        uint256 rating,
        string memory websiteUrl
    ) {
        Profile storage p = profiles[_freelancer];
        return (
            p.bio,
            p.rating,
            p.websiteUrl
        );
    }
}