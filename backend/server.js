// Basic structure for the Express server handling profile requests
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const prisma = require('./prismaClient'); // Assume prisma client setup
const { getProfileFromBlockchain } = require('./blockchainService');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint to fetch a public profile based on an ID (e.g., linked to an NFT or direct contract lookup)
app.get('/api/profile/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID provided' });
    }

    try {
        // In a real application, this would involve reading from the blockchain via an RPC client
        const profileData = await getProfileFromBlockchain(id);

        if (!profileData) {
            return res.status(404).json({ error: 'Freelancer profile not found' });
        }

        res.json(profileData);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to retrieve profile data' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;