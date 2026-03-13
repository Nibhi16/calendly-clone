const prisma = require("../utils/prismaClient");

async function getAvailabilityForUser(userId) {
  return prisma.availability.findMany({
    where: { userId, isActive: true },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }]
  });
}

async function createAvailability(userId, data) {
  const { dayOfWeek, startTime, endTime, timeZone, isActive } = data;

  if (startTime < 0 || endTime > 1440 || endTime <= startTime) {
    const error = new Error("Invalid time range");
    error.status = 400;
    throw error;
  }

  const overlapping = await prisma.availability.findFirst({
    where: {
      userId,
      dayOfWeek,
      isActive: true,
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
      isActive: isActive ?? true
    }
  });
}

async function updateAvailability(userId, id, data) {
  const existing = await prisma.availability.findFirst({
    where: { id, userId }
  });

  if (!existing) {
    const error = new Error("Availability not found");
    error.status = 404;
    throw error;
  }

  const { dayOfWeek, startTime, endTime, timeZone, isActive } = data;

  return prisma.availability.update({
    where: { id },
    data: { dayOfWeek, startTime, endTime, timeZone, isActive }
  });
}

async function deleteAvailability(userId, id) {
  const existing = await prisma.availability.findFirst({
    where: { id, userId }
  });

  if (!existing) {
    const error = new Error("Availability not found");
    error.status = 404;
    throw error;
  }

  return prisma.availability.delete({ where: { id } });
}

module.exports = {
  getAvailabilityForUser,
  createAvailability,
  updateAvailability,
  deleteAvailability
};