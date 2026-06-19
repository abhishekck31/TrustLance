import express from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboard';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});