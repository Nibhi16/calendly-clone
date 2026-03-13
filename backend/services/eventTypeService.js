const prisma = require('../utils/prismaClient');

async function getEventTypesForUser(userId) {
  return prisma.eventType.findMany({
    where: { userId, isActive: true },
    orderBy: { createdAt: 'asc' }
  });
}

async function createEventType(userId, data) {
  const {
    title,
    description,
    durationMinutes,
    slug,
    isActive,
  } = data;

  return prisma.eventType.create({
    data: {
      title,
      description,
      durationMinutes,
      slug,
      isActive: isActive ?? true,
      userId
    }
  });
}

async function updateEventType(userId, id, data) {
  // Ensure the event type belongs to this user
  const existing = await prisma.eventType.findFirst({
    where: { id, userId }
  });
  if (!existing) {
    const error = new Error('Event type not found');
    error.status = 404;
    throw error;
  }

  const { title, description, durationMinutes, slug, isActive } = data;

  return prisma.eventType.update({
    where: { id },
    data: { title, description, durationMinutes, slug, isActive }
  });
}

async function deleteEventType(userId, id) {
  const existing = await prisma.eventType.findFirst({
    where: { id, userId }
  });
  if (!existing) {
    const error = new Error('Event type not found');
    error.status = 404;
    throw error;
  }

  await prisma.eventType.delete({ where: { id } });
}

module.exports = {
  getEventTypesForUser,
  createEventType,
  updateEventType,
  deleteEventType
};

