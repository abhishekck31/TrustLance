// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BookmarkManager {
    struct Bookmark {
        uint256 jobId;
        string jobTitle;
        address savedBy;
        uint256 savedAt;
    }

    mapping(address => Bookmark[]) public userBookmarks;

    event BookmarkSaved(address indexed user, uint256 jobId);
    event BookmarkRemoved(address indexed user, uint256 jobId);

    function saveJob(uint256 _jobId, string memory _jobTitle) public {
        require(_jobId != 0, "Job ID must be valid");
        userBookmarks[msg.sender].push(Bookmark(_jobId, _jobTitle, msg.sender, block.timestamp));
        emit BookmarkSaved(msg.sender, _jobId);
    }

    function getBookmarks(address _user) public view returns (Bookmark[] memory) {
        return userBookmarks[_user];
    }

    function removeBookmark(uint256 _jobId) public {
        // In a real system, we'd need more complex checks (e.g., ownership or specific listing logic).
        // For this simple example, we assume the caller is authorized to remove their own saved item.
        // Since direct removal from an array in Solidity requires re-indexing or using a mapping structure that supports deletions robustly, 
        // for simplicity here we'll focus on adding and viewing unless explicit deletion logic is critical yet.
        // A robust implementation would require the caller to provide an index if removing by position.
        // We will simulate removal by marking the item as not found or using a more complex structure in a full deployment.
        
        // Placeholder for demonstration: In a real scenario, this function requires careful indexing logic based on array management.
        revert("Removal logic is complex and omitted for simplicity in this initial contract version.");
    }
}