import express from 'express';
import dotenv from 'dotenv';
import prisma from './prismaClient'; // Assuming prisma client is initialized
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Allow frontend access
app.use(express.json());

// --- Mock/Placeholder Data Setup (In a real app, this would be DB interactions) ---
async function getMockFindings() {
    // Simulate fetching data from the database
    return [
        { id: 'a1', title: 'Reentrancy Vulnerability in Token Transfer', description: 'Function X allows recursive calls leading to potential re-entry.', severity: 'Critical', status: 'Open', reportDate: new Date(), submittedBy: 'Alice', createdAt: new Date() },
        { id: 'a2', title: 'Insufficient Role-Based Access Control (RBAC)', description: 'Admin roles can access sensitive configuration files.', severity: 'High', status: 'In Progress', reportDate: new Date(), submittedBy: 'Bob', createdAt: new Date() },
        { id: 'a3', title: 'Logging Misconfiguration', description: 'System logs do not capture security-sensitive events adequately.', severity: 'Medium', status: 'Resolved', reportDate: new Date('2024-01-15'), submittedBy: 'Alice', createdAt: new Date() },
    ];
}

// --- API Routes ---

// GET all findings (Dashboard view)
app.get('/api/findings', async (req, res) => {
    try {
        // In a real scenario: const findings = await prisma.auditFinding.findMany();
        const findings = await getMockFindings(); 
        res.json(findings);
    } catch (error) {
        console.error("Error fetching findings:", error);
        res.status(500).json({ error: 'Failed to retrieve audit findings' });
    }
});

// GET single finding (Detail view)
app.get('/api/findings/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // In a real scenario: const finding = await prisma.auditFinding.findUnique({ where: { id } });
        const mockData = [
            { id: 'a1', title: 'Reentrancy Vulnerability in Token Transfer', description: 'Function X allows recursive calls leading to potential re-entry.', severity: 'Critical', status: 'Open', reportDate: new Date(), submittedBy: 'Alice', createdAt: new Date() }
        ].find(f => f.id === id);

        if (!mockData) {
            return res.status(404).json({ error: 'Finding not found' });
        }
        res.json(mockData);
    } catch (error) {
        console.error("Error fetching finding:", error);
        res.status(500).json({ error: 'Failed to retrieve audit finding' });
    }
});


app.listen(PORT, () => {
    console.log(`Audit Findings Backend running on http://localhost:${PORT}`);
});