// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SecurityMonitor {
    event SuspiciousActivity = event(address indexed user, uint256 amount, string reason);

    /**
     * Simulates logging a suspicious activity. In a real system, this would be called by off-chain services or complex contract logic.
     * @param _user The address involved.
     * @param _amount The value associated with the activity.
     * @param _reason A descriptive string about why it is suspicious.
     */
    function logSuspiciousActivity(address _user, uint256 _amount, string memory _reason) public {
        emit SuspiciousActivity(_user, _amount, _reason);
    }

    // Add access control or other monitoring functions here for production use.
}