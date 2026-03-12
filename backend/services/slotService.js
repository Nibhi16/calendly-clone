const { startOfDay, endOfDay, addMinutes, isEqual } = require('date-fns');
const prisma = require('../utils/prismaClient');

/**
 * Generate available time slots for a given event type and date.
 *
 * Time slots are NOT stored in the DB. They are derived from:
 * - weekly availability windows
 * - event duration
 * - existing bookings on that date
 */
async function getSlotsForEventAndDate(slug, dateStr) {
  const eventType = await prisma.eventType.findUnique({
    where: { slug },
    include: { user: true }
  });

  if (!eventType || !eventType.isActive) {
    const error = new Error('Event type not found');
    error.status = 404;
    throw error;
  }

  const { durationMinutes } = eventType;

  // Parse date string (YYYY-MM-DD) and compute day range.
  const date = new Date(dateStr + 'T00:00:00.000Z');
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  // Determine weekday index (0=Sunday..6=Saturday) and map to DayOfWeek enum
  const weekdayIdx = date.getUTCDay(); // 0-6
  const dayEnumMap = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY'
  ];
  const dayOfWeek = dayEnumMap[weekdayIdx];

  // Fetch availability windows for this event's owner on this day.
  const availability = await prisma.availability.findMany({
    where: {
      userId: eventType.userId,
      dayOfWeek,
      isActive: true
    },
    orderBy: { startTime: 'asc' }
  });

  if (!availability.length) {
    return [];
  }

  // Fetch existing bookings on that date for this event type.
  const existingBookings = await prisma.booking.findMany({
    where: {
      eventTypeId: eventType.id,
      startTime: { gte: dayStart, lte: dayEnd }
    }
  });

  const bookedStartTimes = existingBookings.map((b) => b.startTime);

  const slots = [];

  // For each availability window, walk in steps of durationMinutes
  for (const window of availability) {
    const windowStart = addMinutes(dayStart, window.startTime);
    const windowEnd = addMinutes(dayStart, window.endTime);

    let slotStart = windowStart;

    while (slotStart < windowEnd) {
      const slotEnd = addMinutes(slotStart, durationMinutes);

      // Ensure slot fits fully inside the window
      if (slotEnd > windowEnd) break;

      // Check if this slot is already booked (compare startTime)
      const isBooked = bookedStartTimes.some((booked) =>
        isEqual(booked, slotStart)
      );

      if (!isBooked) {
        slots.push({
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString()
        });
      }

      slotStart = slotEnd;
    }
  }

  return slots;
}

module.exports = {
  getSlotsForEventAndDate
};

