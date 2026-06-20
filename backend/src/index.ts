import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes for Audit Findings Tracker
app.get('/api/findings', async (req, res) => {
  try {
    const findings = await prisma.auditFinding.findMany({
      orderBy: { dateReported: 'desc' },
      include: {
        reportedBy: true,
      }
    });
    res.status(200).json(findings);
  } catch (error) {
    console.error('Error fetching audit findings:', error);
    res.status(500).json({ error: 'Failed to fetch audit findings' });
  }
});

// Example endpoint for creating a finding (for completeness)
app.post('/api/findings', async (req, res) => {
    try {
        const newFinding = await prisma.auditFinding.create({
            data: req.body,
        });
        res.status(201).json(newFinding);
    } catch (error) {
        console.error('Error creating audit finding:', error);
        res.status(400).json({ error: 'Failed to create audit finding' });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});