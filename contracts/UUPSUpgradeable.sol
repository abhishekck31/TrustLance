// Base contract defining the standard interface for upgradable contracts.
pragma solidity ^0.8.20;

contract UUPSUpgradeable {
    address public implementation; // Address of the current logic implementation
    address public admin;           // Address that can call the upgrade function

    event Upgraded(address indexed newImplementation);

    constructor(address _implementation) {
        implementation = _implementation;
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "UUPS: Caller is not the admin");
        _;
    }

    // Function to handle the upgrade process
    function upgradeTo(address newImplementation) public onlyAdmin {
        // In a production system, access control (e.g., ownership checks or role-based access) 
        // would be much more complex, likely involving OpenZeppelin's Ownable or AccessControl.
        implementation = newImplementation;
        emit Upgraded(newImplementation);
    }

    // Placeholder functions that derived contracts must implement (for safety/extensibility)
    function doSomething() public view returns (string memory) {
        return "Base functionality executed.";
    }
}