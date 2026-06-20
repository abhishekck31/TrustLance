import express from 'express';
import cors from 'cors';
import { triggerAssessment, getRiskStatus } from './api/riskController';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/assess/:contractAddress', triggerAssessment);
app.get('/api/status/:contractAddress', getRiskStatus);

// Start Server
app.listen(PORT, () => {
    console.log(`TrustLance Risk Backend running on http://localhost:${PORT}`);
});