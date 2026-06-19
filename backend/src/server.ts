import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import metadataRoutes from './routes/metadataRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/metadata', metadataRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});