import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('TrustLance Bookmark Backend Running');
});

// Bookmark Routes
app.post('/bookmarks', async (req, res) => {
  try {
    const { userId, title, url, isJob } = req.body;
    if (!userId || !title || !url || isJob === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const newBookmark = await prisma.bookmark.create({
      data: {
        userId: parseInt(userId),
        title: title,
        url: url,
        isJob: isJob ? true : false,
      },
    });

    res.status(201).json(newBookmark);
  } catch (error) {
    console.error('Error creating bookmark:', error);
    res.status(500).json({ error: 'Failed to create bookmark' });
  }
});

app.get('/bookmarks/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const bookmark = await prisma.bookmark.findUnique({ where: { id } });

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    // In a real app, you would check if the user associated with this bookmark is authenticated/authorized
    res.status(200).json(bookmark);

  } catch (error) {
    console.error('Error fetching bookmark:', error);
    res.status(500).json({ error: 'Failed to fetch bookmark' });
  }
});


app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});