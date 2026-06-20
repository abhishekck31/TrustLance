// backend/src/db/reputationService.ts
import { PrismaClient } from '@prisma/client';
import { InferError } from 'prisma/runtime'; // Placeholder for actual error handling if needed
import { Buffer } from 'buffer';

const prisma = new PrismaClient();

/**
 * Calculates the composite trust score based on historical data.
 * This is the core logic of the Trust Score Engine.
 * @param userAddress The address to calculate the score for.
 * @returns A calculated numerical score.
 */
export async function calculateCompositeTrustScore(userAddress: string): Promise<number> {
    const records = await prisma.TrustScore.findUnique({
        where: { address: userAddress },
        select: { currentScore: String }
    });

    if (!records) {
        // If no record exists, start with a baseline score (e.g., 500 or 1000)
        return 1000;
    }

    const initialScore = parseInt(records.currentScore || '1000');
    let compositeScore = initialScore;

    // --- Scoring Weights Definition ---
    // Define weights for different types of reputation events.
    const weights: { [key: string]: number } = {
        'Transaction': 3,        // Positive weight for successful interactions
        'Approval': 5,           // High weight for explicit approvals
        'GovernanceVote': 10,    // Very high weight for governance participation
        'FailurePenalty': -20,   // Heavy penalty for failed/disputed interactions
    };

    const history = await prisma.TrustScore.findMany({
        where: { address: userAddress },
        orderBy: { lastUpdated: 'desc' },
        include: { records: true }
    });

    for (const item of history) {
        // Iterate through the specific reputation records for this user
        for (const record of item.records) {
            const weight = weights[record.source] || 1; // Default weight if source is unknown

            if (weight !== 1) {
                compositeScore += record.change * weight;
            } else {
                // Apply direct change if no specific weight exists, or default to simple addition
                 compositeScore += record.change;
            }
        }
    }

    // Ensure the score stays within a reasonable bounds (e.g., 0 to 1000)
    let finalScore = Math.max(0, Math.min(1000, compositeScore));

    // Update the stored score in the database (Persistence step)
    await prisma.TrustScore.update({
        where: { address: userAddress },
        data: {
            currentScore: finalScore,
            lastUpdated: new Date(),
        },
    });

    return finalScore;
}

/**
 * Records a raw event and triggers the composite score recalculation.
 * @param userAddress The entity involved.
 * @param source Event type.
 * @param change Delta value.
 * @param counterparty Counterparty address.
 */
export async function recordAndRecalculate(userAddress: string, source: string, change: number, counterparty: string): Promise<number> {
    // 1. Record the raw event to history
    await prisma.ReputationRecord.create({
        data: {
            address: userAddress,
            timestamp: new Date(),
            source: source,
            change: change,
            counterparty: counterparty,
        }
    });

    // 2. Recalculate the composite score (The Engine part)
    const newScore = await calculateCompositeTrustScore(userAddress);

    return newScore;
}


// Example usage for testing (not exported, but good practice):
/*
async function main() {
    try {
        const userAddr = "0x..."; // Example address
        const result = await recordAndRecalculate(userAddr, "Transaction", 100, "0x...");
        console.log(`New Composite Trust Score for ${userAddr}: ${result}`);
    } catch (error) {
        console.error("Error processing:", error);
    } finally {
        await prisma.$disconnect();
    }
}
main();
*/