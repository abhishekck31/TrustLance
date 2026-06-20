import express from 'express';
import dotenv from 'dotenv';
import { db } from './db';
import analyticsRouter from './routes/analytics';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database Check (Optional but good for setup verification)
async function checkDatabaseConnection() {
    try {
        await db.$query('SELECT 1');
        console.log('Database connection successful.');
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
}

// Execute check before starting the server
checkDatabaseConnection().then(() => {
    // Routes
    app.use('/api/analytics', analyticsRouter);

    app.listen(PORT, () => {
        console.log(`TrustLance Backend running on port ${PORT}`);
    });
});