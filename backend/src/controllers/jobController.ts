import { Request, Response } from 'express';
import { db } from '../db';

export const createJob = async (req: Request, res: Response) => {
  try {
    const { title, description, creatorId } = req.body;
    if (!title || !description || !creatorId) {
      return res.status(400).json({ error: 'Missing required fields: title, description, and creatorId' });
    }

    const newJob = await db.Job.create({
      data: {
        title,
        description,
        creatorId,
        status: 'PENDING',
      },
    });

    res.status(201).json(newJob);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ error: 'Failed to create job' });
  }
};

export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await db.Job.findMany();
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Additional CRUD methods (updateJob, deleteJob) would be implemented here...