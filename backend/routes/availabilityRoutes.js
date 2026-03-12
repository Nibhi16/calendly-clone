const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

router.get('/', availabilityController.getAvailability);
router.post('/', availabilityController.createAvailability);
router.put('/:id', availabilityController.updateAvailability);
router.delete('/:id', availabilityController.deleteAvailability);

module.exports = router;

