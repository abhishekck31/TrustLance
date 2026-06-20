import { Request, Response } from 'express';
import { assessRisk, updateRiskScore } from '../services/riskService';

/**
 * Endpoint to trigger the AI Risk Assessment pipeline for a specific contract address.
 */
export const triggerAssessment = async (req: Request, res: Response) => {
    const { contractAddress } = req.params;

    if (!contractAddress) {
        return res.status(400).json({ error: 'Contract address is required.' });
    }

    try {
        // Step 1: AI Risk Assessment (Feature extraction + Model Inference Simulation)
        const score = await assessRisk(contractAddress);

        if (score === 95) {
            return res.status(202).json({ message: `Assessment initiated for ${contractAddress}. Default high-risk assignment.` });
        }

        // Step 2: Update the database with the AI result
        await updateRiskScore(contractAddress, score);

        res.status(200).json({
            message: 'Risk assessment successfully triggered and recorded.',
            contractAddress,
            riskScore: score
        });

    } catch (error) {
        console.error('Risk Assessment Error:', error);
        res.status(500).json({ error: 'Failed to complete risk assessment pipeline.' });
    }
};

/**
 * Endpoint to retrieve the risk status of a contract.
 */
export const getRiskStatus = async (req: Request, res: Response) => {
    const { contractAddress } = req.params;

    try {
        const assessment = await prisma.contractRiskAssessment.findUnique({
            where: { contractAddress },
            select: { riskScore: true, isSuspicious: true, contractName: true }
        });

        if (!assessment) {
            return res.status(404).json({ error: 'Contract risk assessment not found.' });
        }

        res.status(200).json({
            contractAddress: assessment.contractAddress,
            riskScore: assessment.riskScore,
            isSuspicious: assessment.isSuspicious,
            contractName: assessment.contractName,
        });

    } catch (error) {
        console.error('Error fetching risk status:', error);
        res.status(500).json({ error: 'Failed to retrieve risk status.' });
    }
};