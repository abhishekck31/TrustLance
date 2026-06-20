// backend/src/routes/trustRoutes.ts
import { Router } from 'express';
import { recordAndRecalculate } from '../db/reputationService';

const router = Router();

/**
 * POST /api/trust/record
 * Records a new reputation event and triggers the composite score calculation.
 * Payload: { address: string, source: string, change: number, counterparty: string }
 */
router.post('/record', async (req, res) => {
    try {
        const { address, source, change, counterparty } = req.body;

        if (!address || !source || typeof change !== 'number' || !counterparty) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        // Ensure addresses are properly formatted (though Prisma handles strings well, it's good practice)
        const userAddress = address.toLowerCase();
        const counterpartyAddress = counterparty.toLowerCase();

        if (!userAddress || !counterpartyAddress) {
            return res.status(400).json({ error: "Invalid address format." });
        }

        // Execute the core logic
        const newScore = await recordAndRecalculate(userAddress, source, change, counterpartyAddress);

        res.status(200).json({ 
            message: `Reputation recorded and score updated successfully.`,
            newTrustScore: newScore
        });

    } catch (error) {
        console.error("Error in /record route:", error);
        res.status(500).json({ error: "Failed to record reputation event." });
    }
});


/**
 * GET /api/trust/:address/score
 * Retrieves the current composite trust score for an address.
 */
router.get('/:address/score', async (req, res) => {
    const { address } = req.params;

    try {
        const score = await prisma.TrustScore.findUnique({
            where: { address: address.toLowerCase() },
            select: { currentScore: String }
        });

        if (!score) {
            return res.status(404).json({ error: "Trust score not found for this address." });
        }

        res.status(200).json({ 
            address: address, 
            trustScore: parseInt(score.currentScore || '0')
        });

    } catch (error) {
        console.error("Error in /score route:", error);
        res.status(500).json({ error: "Failed to retrieve trust score." });
    }
});


/**
 * GET /api/trust/:address/history
 * Retrieves the full reputation history for an address.
 */
router.get('/:address/history', async (req, res) => {
    const { address } = req.params;

    try {
        const history = await prisma.TrustScore.findUnique({
            where: { address: address.toLowerCase() },
            select: { records: { orderBy: { timestamp: 'desc' } } }
        });

        if (!history) {
            return res.status(404).json({ error: "Reputation history not found." });
        }

        res.status(200).json({ address: address, history: history.records });

    } catch (error) {
        console.error("Error in /history route:", error);
        res.status(500).json({ error: "Failed to retrieve reputation history." });
    }
});


export default router;