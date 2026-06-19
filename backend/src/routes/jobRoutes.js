const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// Job Management Routes
router.post('/', jobController.createJob);
router.get('/:jobId', jobController.getJobDetails);
router.put('/:jobId', jobController.updateJob);

module.exports = router;