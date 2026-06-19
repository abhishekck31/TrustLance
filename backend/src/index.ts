import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// --- API Endpoints ---

// Endpoint to get a user profile with skills and reputation
app.get('/api/user/:username', async (req, res) => {
  try {
    const user = await prisma.User.findUnique({
      where: { username: req.params.username },
      include: {
        skills: true,
        reputation: true,
        portfolio: true, // Include portfolio for demonstration
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});


// Placeholder for a simple seed/test route (optional, but helpful for testing the demo)
app.get('/api/users', async (req, res) => {
    const users = await prisma.User.findMany();
    res.json(users);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});

// Note: In a real application, this file would be integrated into the main server entry point (e.g., server.ts)
export default app;