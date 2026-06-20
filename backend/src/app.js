// Main entry point for the backend application (Node/Express).
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const analyticsRoutes = require('./routes/analytics');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', analyticsRoutes);

app.get('/', (req, res) => {
    res.send('TrustLance Backend API Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});