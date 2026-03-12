const { addMinutes, startOfDay, endOfDay } = require('date-fns');
const prisma = require('../utils/prismaClient');

async function createBooking(payload) {
  const { eventSlug, date, startTime, guestName, guestEmail, guestTimeZone } =
    payload;

  const eventType = await prisma.eventType.findUnique({
    where: { slug: eventSlug },
    include: { user: true }
  });

  if (!eventType || !eventType.isActive) {
    const error = new Error('Event type not found');
    error.status = 404;
    throw error;
  }

  const start = new Date(startTime);
  const end = addMinutes(start, eventType.durationMinutes);

  // Check if there is already a booking for this event type at this startTime
  const existing = await prisma.booking.findFirst({
    where: {
      eventTypeId: eventType.id,
      startTime: start
    }
  });

  if (existing) {
    const error = new Error('Slot already booked');
    error.status = 409;
    throw error;
  }

  const booking = await prisma.booking.create({
    data: {
      eventTypeId: eventType.id,
      hostId: eventType.userId,
      guestEmail,
      guestName,
      status: 'CONFIRMED',
      startTime: start,
      endTime: end,
      hostTimeZone: eventType.user.timeZone,
      guestTimeZone: guestTimeZone || null
    },
    include: {
      eventType: true
    }
  });

  return booking;
}

async function getUpcomingBookingsForHost(hostId) {
  const now = new Date();
  return prisma.booking.findMany({
    where: {
      hostId,
      startTime: { gt: now },
      status: { not: 'CANCELED' }
    },
    orderBy: { startTime: 'asc' },
    include: {
      eventType: true
    }
  });
}

async function getPastBookingsForHost(hostId) {
  const now = new Date();
  return prisma.booking.findMany({
    where: {
      hostId,
      startTime: { lt: now }
    },
    orderBy: { startTime: 'desc' },
    include: {
      eventType: true
    }
  });
}

async function cancelBooking(id, hostId) {
  const existing = await prisma.booking.findFirst({
    where: { id, hostId }
  });

  if (!existing) {
    const error = new Error('Booking not found');
    error.status = 404;
    throw error;
  }

  await prisma.booking.update({
    where: { id },
    data: { status: 'CANCELED' }
  });
}

module.exports = {
  createBooking,
  getUpcomingBookingsForHost,
  getPastBookingsForHost,
  cancelBooking
};

