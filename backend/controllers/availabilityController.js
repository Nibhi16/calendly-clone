const availabilityService = require('../services/availabilityService');

async function getAvailability(req, res, next) {
  try {
    const availability =
      await availabilityService.getAvailabilityForUser(req.user.id);

    res.json(Array.isArray(availability) ? availability : []);
  } catch (err) {
    next(err);
  }
}

async function createAvailability(req, res, next) {
  try {
    const record = await availabilityService.createAvailability(
      req.user.id,
      req.body
    );
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
}

async function updateAvailability(req, res, next) {
  try {
    const { id } = req.params;
    const record = await availabilityService.updateAvailability(
      req.user.id,
      id,
      req.body
    );
    res.json(record);
  } catch (err) {
    next(err);
  }
}

async function deleteAvailability(req, res, next) {
  try {
    const { id } = req.params;
    await availabilityService.deleteAvailability(req.user.id, id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability
};