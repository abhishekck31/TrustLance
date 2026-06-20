// Core Node.js server setup for the API endpoints.
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const redisClient = require('./redisClient'); // Assuming a Redis client exists

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Prisma Client (Mocked for structure)
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/**
 * Mock AI Explanation Generator function.
 * In a real application, this would call an external LLM API (e.g., OpenAI, Gemini).
 * @param {object} contractData - Raw data from the blockchain query.
 * @returns {string} - Natural language explanation.
 */
function generateExplanation(contractData) {
    const { address, status, details } = contractData;

    let explanation = `--- Contract Status for Address: ${address} ---\n`;
    explanation += `Overall Status: ${status}\n\n`;

    if (details && details.transactions) {
        explanation += `Transaction History:\n`;
        details.transactions.forEach(tx => {
            explanation += `- [${tx.timestamp}] Action: ${tx.action} by ${tx.user} (${tx.amount})\n`;
        });
    } else if (details && details.currentEscrow) {
         explanation += `Current Escrow Amount: ${details.currentEscrow}\n`;
    } else {
        explanation += "No detailed transaction history found at this time.";
    }

    if (status === 'Active') {
        explanation += "\nConclusion: The contract appears to be functioning normally according to the latest data.";
    } else if (status === 'Completed') {
        explanation += "\nConclusion: All stipulated actions in the escrow have been finalized.";
    } else {
         explanation += "\nConclusion: Further investigation into specific events is recommended.";
    }

    return explanation;
}


// API Endpoint to fetch and explain contract status
app.get('/api/contract-status/:address', async (req, res) => {
    const { address } = req.params;

    try {
        // 1. Simulate fetching data from Blockchain (e.g., via Web3 provider or indexing service)
        console.log(`Fetching status for contract: ${address}`);
        
        // Mock Data Retrieval simulating a complex blockchain query result
        const mockBlockchainData = {
            address: address,
            status: 'Active',
            details: {
                currentEscrow: 5000 ether,
                transactions: [
                    { timestamp: Date.now() - 86400000, action: 'Deposit', user: '0xAlice', amount: 1000 },
                    { timestamp: Date.now() - 3600000, action: 'Withdrawal', user: '0xBob', amount: 2000 },
                ]
            }
        };

        // 2. Generate AI Explanation
        const explanation = generateExplanation(mockBlockchainData);

        res.json({ address, status, explanation });

    } catch (error) {
        console.error("Error fetching contract status:", error);
        res.status(500).json({ error: "Failed to retrieve or explain contract status." });
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`TrustLance Backend running on http://localhost:${PORT}`);
});

// Mock Redis Client Setup (Required by structure)
// In a real setup, this would be configured elsewhere.
module.exports = { app };