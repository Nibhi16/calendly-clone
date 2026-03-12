const prisma = require("../utils/prismaClient");

/**
 * Get all availability windows for a user
 */
async function getAvailabilityForUser(userId) {
  return prisma.availability.findMany({
    where: {
      userId,
      isActive: true
    },
    orderBy: [
      { dayOfWeek: "asc" },
      { startTime: "asc" }
    ]
  });
}

/**
 * Create a new availability window
 */
async function createAvailability(userId, data) {
  const {
    dayOfWeek,
    startTime,
    endTime,
    timeZone,
    eventTypeId,
    isActive
  } = data;

  // Validate time range
  if (startTime < 0 || endTime > 1440 || endTime <= startTime) {
    const error = new Error("Invalid time range");
    error.status = 400;
    throw error;
  }

  // Prevent overlapping availability windows
  const overlapping = await prisma.availability.findFirst({
    where: {
      userId,
      dayOfWeek,
      isActive: true,
      eventTypeId: eventTypeId || null,
      NOT: {
        OR: [
          { endTime: { lte: startTime } }, 
          { startTime: { gte: endTime } }
        ]
      }
    }
  });

  if (overlapping) {
    const error = new Error("Availability window overlaps with an existing one");
    error.status = 400;
    throw error;
  }

  return prisma.availability.create({
    data: {
      userId,
      dayOfWeek,
      startTime,
      endTime,
      timeZone,
      eventTypeId: eventTypeId || null,
      isActive: isActive ?? true
    }
  });
}

/**
 * Update an availability window
 */
async function updateAvailability(userId, id, data) {
  const existing = await prisma.availability.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!existing) {
    const error = new Error("Availability not found");
    error.status = 404;
    throw error;
  }

  return prisma.availability.update({
    where: { id },
    data
  });
}

/**
 * Delete an availability window
 */
async function deleteAvailability(userId, id) {
  const existing = await prisma.availability.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!existing) {
    const error = new Error("Availability not found");
    error.status = 404;
    throw error;
  }

  return prisma.availability.delete({
    where: { id }
  });
}

module.exports = {
  getAvailabilityForUser,
  createAvailability,
  updateAvailability,
  deleteAvailability
};