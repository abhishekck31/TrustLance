// Node.js Express server setup, linking to the database layer (Prisma mock) and potential blockchain interaction.
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const prisma = require('./prismaClient'); // Assume Prisma setup exists

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// --- Mock Data/Service Layer ---
// In a real application, this layer would handle Web3 interactions (ethers.js)
// and database persistence (Prisma calls).

app.get('/api/talents/:id', async (req, res) => {
    const talentId = parseInt(req.params.id);
    console.log(`Fetching talent details for ID: ${talentId}`);

    // Mock response based on contract data simulation
    const mockData = {
        id: talentId,
        name: `Talent_${talentId}`,
        isFeatured: talentId % 5 === 0, // Mock featured status for testing
        details: {
            talentAddress: '0xMockTalentAddress',
            listingTimestamp: Date.now() - (talentId * 1000)
        }
    };

    res.json(mockData);
});

app.post('/api/talents/feature/:id', async (req, res) => {
    const talentId = parseInt(req.params.id);
    // In a real app: Call smart contract function via Web3 provider
    console.log(`Attempting to set Talent ${talentId} as Featured.`);

    try {
        // Simulate successful blockchain transaction (e.g., calling setTalentAsFeatured)
        const success = true; // Replace with actual eth_sendTransaction logic
        if (success) {
            res.status(200).json({ message: `Talent ${talentId} successfully marked as featured.` });
        } else {
            res.status(400).json({ message: "Blockchain transaction failed." });
        }
    } catch (error) {
        console.error("Feature API Error:", error);
        res.status(500).json({ message: "Internal server error during feature setting." });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});