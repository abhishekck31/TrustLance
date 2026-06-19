import { Router } from 'express';
import milestoneService from '../milestoneService';
import { createMilestone, getMilestones, updateMilestoneStatus, getMilestoneById } from '../milestoneService';

const router = Router();

// POST /api/milestones - Create a new milestone
router.post('/', async (req, res) => {
  try {
    const milestoneData = req.body;
    if (!milestoneData.title || !milestoneData.progress) {
      return res.status(400).json({ error: 'Title and progress are required.' });
    }
    const newMilestone = await milestoneService.createMilestone(milestoneData);
    res.status(201).json(newMilestone);
  } catch (error) {
    console.error('Error creating milestone:', error);
    res.status(500).json({ error: 'Failed to create milestone.' });
  }
});

// GET /api/milestones - Get all milestones or filter by status
router.get('/', async (req, res) => {
  try {
    const statusFilter = req.query.status ? req.query.status.toUpperCase() as any : undefined;
    const milestones = await milestoneService.getMilestones(statusFilter ? statusFilter as any : undefined);
    res.json(milestones);
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).json({ error: 'Failed to fetch milestones.' });
  }
});

// PUT /api/milestones/:id/approve - Update milestone status (Approval Flow)
router.put('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approverId } = req.body;

    if (!status || !approverId) {
      return res.status(400).json({ error: 'Status and Approver ID are required for approval.' });
    }

    const updatedMilestone = await milestoneService.updateMilestoneStatus(id, status, approverId);
    res.json(updatedMilestone);
  } catch (error) {
    console.error('Error updating milestone status:', error);
    res.status(500).json({ error: 'Failed to update milestone status.' });
  }
});

// GET /api/milestones/:id - Get single milestone details
router.get('/:id', async (req, res) => {
    try {
        const milestone = await milestoneService.getMilestoneById(req.params.id);
        if (!milestone) {
            return res.status(404).json({ error: 'Milestone not found.' });
        }
        res.json(milestone);
    } catch (error) {
        console.error('Error fetching milestone:', error);
        res.status(500).json({ error: 'Failed to fetch milestone details.' });
    }
});


export default router;