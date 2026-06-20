// Main entry point for the Node.js/Express API server.
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// --- Mock Web3 Interaction Layer Placeholder ---
// In a real application, this layer would handle signing transactions via ethers.js/web3.js
const mockWeb3Service = {
    sendTransaction: async (address, functionName, args) => {
        console.log(`[MOCK WEB3] Executing ${functionName} for address ${address}`);
        // Simulate success
        return { success: true, txHash: `0xmockhash${Date.now()}` };
    },
    readFavorites: async (address) => {
        // Placeholder for fetching on-chain favorites
        return [];
    }
};
// ---------------------------------------------------


// API Routes

// 1. Get User Favorites
app.get('/api/user/favorites', async (req, res) => {
    try {
        const userId = req.user.id; // Assume user context is attached by middleware
        const favorites = await prisma.SavedJob.findMany({
            where: { userId: userId },
            include: { job: true }
        });
        res.json(favorites);
    } catch (error) {
        console.error("Error fetching user favorites:", error);
        res.status(500).json({ error: "Failed to fetch favorites" });
    }
});

// 2. Save a Job as Favorite (Simulated interaction with the contract)
app.post('/api/favorites/add/:jobId', async (req, res) => {
    const { jobId } = req.params;
    const userId = req.user.id; // Get user from context

    try {
        // In a real scenario: Call the deployed contract's addFavorite function using web3 provider
        const tx = await mockWeb3Service.sendTransaction(userId, 'addFavorite', jobId);
        console.log(`Transaction successful: ${tx.txHash}`);

        // Update local DB state (for quick response/caching)
        await prisma.SavedJob.update({
            where: { userId: userId, jobId: jobId },
            data: { isFavorite: true }
        });

        res.status(200).json({ message: `Job ${jobId} favorited successfully`, txHash: tx.txHash });

    } catch (error) {
        console.error("Error saving favorite:", error);
        res.status(500).json({ error: "Failed to save favorite" });
    }
});

// 3. Fetch All User Favorites
app.get('/api/user/all-favorites', async (req, res) => {
    try {
        const userId = req.user.id;
        const favorites = await prisma.SavedJob.findMany({
            where: { userId: userId },
            include: { job: true }
        });
        res.json(favorites);
    } catch (error) {
        console.error("Error fetching all user favorites:", error);
        res.status(500).json({ error: "Failed to fetch all favorites" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});