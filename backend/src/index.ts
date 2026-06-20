import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// --- Bookmark Endpoints ---

// GET /api/bookmarks (Get user's saved jobs)
app.get('/api/bookmarks', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const bookmark = await prisma.bookmark.findUnique({
      where: { userId: userId },
      include: { job: true }
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmarks not found for this user' });
    }

    res.json(bookmark);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: 'Failed to retrieve bookmarks' });
  }
});

// POST /api/bookmarks (Save a new job as a bookmark)
app.post('/api/bookmarks', async (req, res) => {
  try {
    const { userId, jobId, jobTitle } = req.body;

    if (!userId || !jobId || !jobTitle) {
      return res.status(400).json({ error: 'Missing required fields: userId, jobId, or jobTitle' });
    }

    // Check if the bookmark already exists (ensuring uniqueness based on schema index)
    const existing = await prisma.bookmark.findUnique({ where: { userId, jobId } });
    if (existing) {
        return res.status(409).json({ message: 'This job is already saved.' });
    }

    const newBookmark = await prisma.bookmark.create({
      data: {
        userId,
        jobId,
        jobTitle,
      },
    });

    res.status(201).json(newBookmark);

  } catch (error) {
    console.error('Error saving bookmark:', error);
    res.status(500).json({ error: 'Failed to save bookmark' });
  }
});


// Start Server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});