const slotService = require('../services/slotService');

// GET /slots?slug={eventSlug}&date={YYYY-MM-DD}
async function getSlotsForDate(req, res, next) {
  try {
    const { slug, date } = req.query;
    if (!slug || !date) {
      return res.status(400).json({ message: 'slug and date are required' });
    }
    const slots = await slotService.getSlotsForEventAndDate(slug, date);
    res.json(slots);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSlotsForDate
};

