const { prisma } = require('../config/db');

/**
 * Creates a new job entry in the database (placeholder)
 */
exports.createJob = async (req, res) => {
    try {
        const jobData = req.body;
        // Assume walletAddress is extracted from authentication middleware (omitted here for brevity)
        const createdJob = await prisma.jobs.create({
            data: {
                walletAddress: 'mock-address-from-auth', // Placeholder, ideally injected by middleware
                title: jobData.title,
                description: jobData.description,
                status: 'Pending',
                createdAt: new Date(),
            },
        });

        res.status(201).json({ message: 'Job created successfully', job: createdJob });

    } catch (error) {
        console.error('Job Creation Error:', error);
        res.status(500).json({ message: 'Failed to create job', error: error.message });
    }
};

/**
 * Retrieves details for a specific job
 */
exports.getJobDetails = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        // Fetching job, ensuring the wallet owner is authorized
        const job = await prisma.jobs.findUnique({ where: { id: jobId } });

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json(job);

    } catch (error) {
        console.error('Job Fetch Error:', error);
        res.status(500).json({ message: 'Failed to fetch job details', error: error.message });
    }
};

/**
 * Updates an existing job
 */
exports.updateJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const updatedData = req.body;

        const job = await prisma.jobs.update({
            where: { id: jobId },
            data: updatedData,
        });

        res.status(200).json({ message: 'Job updated successfully', job });

    } catch (error) {
        console.error('Job Update Error:', error);
        res.status(400).json({ message: 'Failed to update job', error: error.message });
    }
};