const eventTypeService = require('../services/eventTypeService');

async function getEventTypes(req, res, next) {
  try {
    const eventTypes = await eventTypeService.getEventTypesForUser(req.user.id);
    res.json(eventTypes);
  } catch (err) {
    next(err);
  }
}

async function createEventType(req, res, next) {
  try {
    const eventType = await eventTypeService.createEventType(req.user.id, req.body);
    res.status(201).json(eventType);
  } catch (err) {
    next(err);
  }
}

async function updateEventType(req, res, next) {
  try {
    const { id } = req.params;
    const eventType = await eventTypeService.updateEventType(req.user.id, id, req.body);
    res.json(eventType);
  } catch (err) {
    next(err);
  }
}

async function deleteEventType(req, res, next) {
  try {
    const { id } = req.params;
    await eventTypeService.deleteEventType(req.user.id, id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getEventTypes,
  createEventType,
  updateEventType,
  deleteEventType
};

