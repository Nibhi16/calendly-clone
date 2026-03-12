const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.createBooking);
router.get('/upcoming', bookingController.getUpcomingBookings);
router.get('/past', bookingController.getPastBookings);
router.delete('/:id', bookingController.cancelBooking);

module.exports = router;

