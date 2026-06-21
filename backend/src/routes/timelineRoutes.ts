// TrustLance Backend Route Definition (Express)

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const router = Router();
const prisma = new PrismaClient();

/**
 * @route POST /api/jobs/:id/fund
 * @desc Fund a job milestone
 * @access Private (Requires authorization check)
 */
router.post('/jobs/:id/fund', async (req: Request, res: Response) => {
    const jobId = parseInt(req.params.id);
    try {
        const updatedJob = await prisma.job.update({
            where: { id: jobId },
            data: {
                fundedAt: new Date()
            }
        });
        res.status(200).json({ message: `Job ${jobId} funded successfully.`, job: updatedJob });
    } catch (error) {
        console.error('Error funding job:', error);
        res.status(400).json({ error: 'Failed to fund job.' });
    }
});

/**
 * @route POST /api/jobs/:id/milestone
 * @desc Set a milestone for the job
 * @access Private (Requires authorization check)
 */
router.post('/jobs/:id/milestone', async (req: Request, res: Response) => {
    const jobId = parseInt(req.params.id);
    try {
        const updatedJob = await prisma.job.update({
            where: { id: jobId },
            data: {
                milestoneAt: new Date()
            }
        });
        res.status(200).json({ message: `Milestone set for Job ${jobId}.`, job: updatedJob });
    } catch (error) {
        console.error('Error setting milestone:', error);
        res.status(400).json({ error: 'Failed to set milestone.' });
    }
});

/**
 * @route POST /api/jobs/:id/approve
 * @desc Approve the job
 * @access Private (Requires authorization check)
 */
router.post('/jobs/:id/approve', async (req: Request, res: Response) => {
    const jobId = parseInt(req.params.id);
    try {
        const updatedJob = await prisma.job.update({
            where: { id: jobId },
            data: {
                approvedAt: new Date()
            }
        });
        res.status(200).json({ message: `Job ${jobId} approved successfully.`, job: updatedJob });
    } catch (error) {
        console.error('Error approving job:', error);
        res.status(400).json({ error: 'Failed to approve job.' });
    }
});

/**
 * @route POST /api/jobs/:id/release
 * @desc Release the final job
 * @access Private (Requires authorization check)
 */
router.post('/jobs/:id/release', async (req: Request, res: Response) => {
    const jobId = parseInt(req.params.id);
    try {
        const updatedJob = await prisma.job.update({
            where: { id: jobId },
            data: {
                releasedAt: new Date()
            }
        });
        res.status(200).json({ message: `Job ${jobId} released successfully.`, job: updatedJob });
    } catch (error) {
        console.error('Error releasing job:', error);
        res.status(400).json({ error: 'Failed to release job.' });
    }
});

/**
 * @route GET /api/jobs/:id/timeline
 * @desc Get the full timeline history for a job
 * @access Private (Requires authorization check)
 */
router.get('/jobs/:id/timeline', async (req: Request, res: Response) => {
    const jobId = parseInt(req.params.id);
    try {
        const job = await prisma.job.findUnique({ where: { id: jobId } });

        if (!job) {
            return res.status(404).json({ error: 'Job not found.' });
        }

        // Fetch all timeline points
        const timeline = {
            id: job.id,
            projectName: job.projectName,
            creator: job.creator,
            created: job.createdAt.toISOString(),
            funded: job.fundedAt ? job.fundedAt.toISOString() : null,
            milestone: job.milestoneAt ? job.milestoneAt.toISOString() : null,
            approved: job.approvedAt ? job.approvedAt.toISOString() : null,
            released: job.releasedAt ? job.releasedAt.toISOString() : null,
        };

        res.status(200).json(timeline);

    } catch (error) {
        console.error('Error fetching timeline:', error);
        res.status(500).json({ error: 'Failed to fetch job timeline.' });
    }
});

export default router;