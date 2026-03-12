const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');

// GET /slots?slug={eventSlug}&date={YYYY-MM-DD}
router.get('/', slotController.getSlotsForDate);

module.exports = router;

