import { Router } from 'express';
import { createJob, getJobs } from '../controllers/jobController';

const router = Router();

// POST /api/jobs - Create a new job
router.post('/', createJob);

// GET /api/jobs - Retrieve all jobs
router.get('/', getJobs);

export default router;