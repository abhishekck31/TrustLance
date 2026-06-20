// Mock contract for demonstration purposes. In a real scenario, this would be deployed and interacted with via the backend.
pragma solidity ^0.8.20;

contract EscrowContract {
    address public owner;
    uint256 public escrowAmount;
    mapping(address => uint256) public balances;

    event FundsDeposited(address indexed depositor, uint256 amount);
    event FundsReleased(address indexed recipient, uint256 amount);

    constructor(uint256 initialAmount) {
        owner = msg.sender;
        escrowAmount = initialAmount;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    function deposit() public payable {
        require(msg.value > 0, "Deposit must be greater than zero");
        balances[msg.sender] += msg.value;
        emit FundsDeposited(msg.sender, msg.value);
    }

    function releaseFunds(address payable recipient, uint256 amount) public onlyOwner {
        require(balances[recipient] >= amount, "Insufficient funds for release");
        balances[recipient] -= amount;
        emit FundsReleased(recipient, amount);
    }

    function getStatus() public view returns (uint256 currentEscrow, address owner) {
        return (escrowAmount, owner);
    }
}