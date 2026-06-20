import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// --- AI Assistant Endpoints ---

/**
 * Endpoint to get a proposal by ID (Simulated)
 */
app.get('/proposals/:id', async (req, res) => {
    try {
        const proposal = await prisma.proposal.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!proposal) {
            return res.status(404).json({ error: 'Proposal not found' });
        }
        res.json(proposal);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch proposal' });
    }
});

/**
 * Endpoint to trigger the AI summarization process (Mocked LLM call)
 * In a real scenario, this would call an external service like OpenAI or Gemini.
 */
app.post('/proposals/:id/summarize', async (req, res) => {
    const proposalId = parseInt(req.params.id);

    try {
        // 1. Fetch the full text from the database
        const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } });

        if (!proposal) {
            return res.status(404).json({ error: 'Proposal not found' });
        }

        // 2. Simulate AI Summarization Logic (Replace this block with actual LLM API call)
        const fullText = proposal.body;
        let summary = `[AI Summary for Proposal ID ${proposalId}]: This is a simulated summary based on the full text of the proposal: "${fullText.substring(0, 50)}..."`;

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 3. Update the database with the generated summary
        await prisma.proposal.update({
            where: { id: proposalId },
            data: { aiSummary: summary }
        });

        res.json({ message: 'Summary successfully generated and saved.', summary: summary });

    } catch (error) {
        console.error('Error during summarization:', error);
        res.status(500).json({ error: 'Failed to process request or generate summary' });
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`TrustLance AI Assistant Backend running on port ${PORT}`);
});