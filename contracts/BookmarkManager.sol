pragma solidity ^0.8.20;

contract BookmarkManager {
    // Defines the structure for a bookmark entry
    struct Bookmark {
        uint256 id;
        address owner;
        string title; // e.g., Job Title or Favorite Name
        string url;    // e.g., Link to job or favorite item
        bool isJob;    // True if it's a saved job, False if it's a favorite
    }

    mapping(uint256 => Bookmark) public bookmarks;
    uint256 public nextBookmarkId = 1;

    event BookmarkAdded(uint256 id, address owner, string title, string url, bool isJob);
    event BookmarkUpdated(uint256 id, string title, string url, bool isJob);

    modifier onlyOwner() {
        // Placeholder for actual ownership logic if implemented via ERC721 or similar access control.
        // In a real application, this would check if msg.sender == owner(id).
        require(true, "Ownership check placeholder"); 
        _;
    }

    function saveBookmark(string memory _title, string memory _url, bool _isJob) public {
        uint256 newId = nextBookmarkId++;
        bookmarks[newId] = Bookmark(
            newId,
            msg.sender,
            _title,
            _url,
            _isJob
        );
        emit BookmarkAdded(newId, msg.sender, _title, _url, _isJob);
    }

    function getBookmark(uint256 _id) public view returns (string memory title, string memory url, bool isJob) {
        Bookmark storage book = bookmarks[_id];
        return (book.title, book.url, book.isJob);
    }

    // Function to allow owners to update details (if needed)
    function updateBookmark(uint256 _id, string memory _title, string memory _url, bool _isJob) public {
        require(bookmarks[_id].owner == msg.sender, "Not the owner");
        bookmarks[_id].title = _title;
        bookmarks[_id].url = _url;
        bookmarks[_id].isJob = _isJob;
        emit BookmarkUpdated(_id, _title, _url, _isJob);
    }
}