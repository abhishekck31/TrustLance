// Express route definitions for handling talent-related requests.
import { Router } from 'express';
import { talentService } from '../services/talentService';

const router = Router();

// POST /api/talents - Create a new talent profile
router.post('/', async (req, res) => {
    try {
        const { name, description, isFeatured } = req.body;
        if (!name || !description) {
            return res.status(400).json({ error: "Name and description are required." });
        }

        const talentData = { name, description, isFeatured: !!isFeatured };
        const talent = await talentService.createTalent(talentData);

        res.status(201).json(talent);
    } catch (error) {
        console.error("Error creating talent:", error);
        res.status(500).json({ error: "Failed to create talent." });
    }
});

// GET /api/talents/featured - Get all featured talents
router.get('/featured', async (req, res) => {
    try {
        const featuredTalents = await talentService.getFeaturedTalents();
        res.status(200).json(featuredTalents);
    } catch (error) {
        console.error("Error fetching featured talents:", error);
        res.status(500).json({ error: "Failed to fetch featured talents." });
    }
});

// PUT /api/talents/:id/featured - Update the featured status of a talent
router.put('/:id/featured', async (req, res) => {
    const id = parseInt(req.params.id);
    const isFeatured = req.body.isFeatured;

    if (isNaN(id) || !['true', 'false'].includes(req.body.isFeatured)) {
        return res.status(400).json({ error: "Invalid ID or status provided." });
    }

    try {
        const success = await talentService.updateFeatureStatus(id, isFeatured === 'true');
        if (!success) {
            return res.status(404).json({ error: `Talent with ID ${id} not found.` });
        }
        res.status(200).json({ message: `Talent ID ${id} feature status updated successfully to ${isFeatured ? 'Featured' : 'Unfeatured'}.` });
    } catch (error) {
        console.error("Error updating talent feature:", error);
        res.status(500).json({ error: "Failed to update talent status." });
    }
});

export default router;