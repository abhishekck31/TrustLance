import express from 'express';
import cors from 'cors';
import milestoneRoutes from './routes/milestones';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/milestones', milestoneRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});