const express = require('express');
const { getData, createData } = require('../controllers/apiController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/data', authMiddleware, getData);
router.post('/data', authMiddleware, createData);

module.exports = router;
