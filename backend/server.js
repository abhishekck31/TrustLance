// Backend setup using Express and simulating data fetching from the blockchain layer (or a database index)
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock data representing retrieved profile information
const mockProfiles = {
    '0xFreelancerA1B2': {
        bio: "Expert in Web3 development and smart contract auditing. Passionate about decentralized finance.",
        rating: 4.9,
        websiteUrl: "https://freelancerA.com"
    },
    '0xFreelancerC3D4': {
        bio: "Creative UI/UX designer specializing in modern web applications using Next.js and Tailwind CSS.",
        rating: 4.8,
        websiteUrl: "https://designerC.dev"
    }
};

/**
 * Endpoint to fetch a specific freelancer profile by address.
 * This endpoint serves the data required for public profile pages.
 */
app.get('/api/profile/:address', (req, res) => {
    const targetAddress = req.params.address;
    const profileData = mockProfiles[targetAddress];

    if (!profileData) {
        return res.status(404).json({ error: 'Profile not found' });
    }

    // Return the data structured for easy frontend consumption
    res.json({
        address: targetAddress,
        bio: profileData.bio,
        rating: profileData.rating,
        websiteUrl: profileData.websiteUrl
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});