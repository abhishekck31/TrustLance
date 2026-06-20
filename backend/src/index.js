// Main entry point for the Node.js/Express backend. Handles Web3 interaction.
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let provider;
let signer;

// --- Web3 Connection Setup ---
async function setupWeb3(providerInstance, signerInstance) {
    provider = providerInstance;
    signer = signerInstance;
}

// Endpoint to read allocation status from the blockchain
app.get('/api/allocation/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).send({ error: "Allocation ID required" });

        // Assume we are reading from a deployed contract address (e.g., the Treasury contract)
        const treasuryAddress = "0xYOUR_TREASURY_ADDRESS"; // Placeholder! Replace this in production
        const treasuryContract = new ethers.Contract(treasuryAddress, ["function getAllocationDetails(uint256) view returns (address,uint256,uint256,uint256,uint256,bool)"], signer);

        const details = await treasuryContract.getAllocationDetails(parseInt(id));
        res.json({ success: true, data: details });
    } catch (error) {
        console.error("Error fetching allocation details:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve data" });
    }
});

// Endpoint to submit a vote
app.post('/api/vote', async (req, res) => {
    try {
        const { allocationId, voteFor } = req.body;
        if (!allocationId || typeof voteFor === 'undefined') {
            return res.status(400).json({ success: false, message: "Missing allocationId or voteFor" });
        }

        // Assume we are calling the GovernanceSystem contract for voting interaction
        const governanceAddress = "0xYOUR_GOVERNANCE_ADDRESS"; // Placeholder!
        const governanceContract = new ethers.Contract(governanceAddress, ["function callTreasury(uint256,bool)"], signer);

        const tx = await governanceContract.callTreasury(parseInt(allocationId), voteFor);
        await tx.wait(10); // Wait for transaction confirmation

        res.json({ success: true, message: `Vote submitted successfully. Transaction Hash: ${tx.hash}` });

    } catch (error) {
        console.error("Error submitting vote:", error);
        res.status(500).json({ success: false, message: "Failed to submit vote" });
    }
});


app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});