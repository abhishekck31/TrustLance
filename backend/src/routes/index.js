const express = require('express');
const router = express.Router();
const forecastingRoutes = require('./forecastingRoutes');

router.use('/api/forecast', forecastingRoutes);

module.exports = router;