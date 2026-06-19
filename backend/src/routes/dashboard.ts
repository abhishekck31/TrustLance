import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // 1. Get Disputed Projects
    const disputedProjects = await prisma.Project.findMany({
      where: { disputed: true },
      include: {
        totalStaked: true,
      }
    });

    // 2. Get Open Voting Timelines (Simplified: focusing on projects that are voting)
    const activeVotes = await prisma.Vote.findMany({
      where: { isFinal: false },
      include: {
        project: true,
      }
    });

    // 3. Get Staking Pool Metrics (Aggregated view)
    const stakingMetrics = await prisma.StakingPool.findMany();

    res.status(200).json({
      disputedProjects,
      openVotingTimelines: activeVotes,
      stakingPoolMetrics: stakingMetrics,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;