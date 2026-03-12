const express = require('express');
const router = express.Router();
const eventTypeController = require('../controllers/eventTypeController');

router.get('/', eventTypeController.getEventTypes);
router.post('/', eventTypeController.createEventType);
router.put('/:id', eventTypeController.updateEventType);
router.delete('/:id', eventTypeController.deleteEventType);

module.exports = router;

