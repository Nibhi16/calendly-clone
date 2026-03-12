const bookingService = require('../services/bookingService');

async function createBooking(req, res, next) {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
}

async function getUpcomingBookings(req, res, next) {
  try {
    const bookings = await bookingService.getUpcomingBookingsForHost(req.user.id);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

async function getPastBookings(req, res, next) {
  try {
    const bookings = await bookingService.getPastBookingsForHost(req.user.id);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

async function cancelBooking(req, res, next) {
  try {
    const { id } = req.params;
    await bookingService.cancelBooking(id, req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createBooking,
  getUpcomingBookings,
  getPastBookings,
  cancelBooking
};

