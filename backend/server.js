const express = require('express');
const dotenv = require('dotenv');
const db = require('./src/db'); // Initialize DB client access
const indexRouter = require('./src/routes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use(indexRouter);

// Basic health check
app.get('/', (req, res) => {
    res.send('TrustLance Backend Running. Revenue API available.');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});