// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TrustLanceToken is ERC20 {
    constructor(address owner) ERC20("TrustLance", "TL") {
        _mint(owner, 1000 * 10**18); // Mint initial supply
    }
}