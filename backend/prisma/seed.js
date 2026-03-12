require('dotenv').config()
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function main() {
  // Default user
  const user = await prisma.user.upsert({
    where: { email: 'demo@calendly-clone.test' },
    update: {},
    create: {
      email: 'demo@calendly-clone.test',
      name: 'Demo User',
      username: 'demo',
      timeZone: 'UTC'
    }
  });

  // Event types
  const thirtyMin = await prisma.eventType.upsert({
    where: { slug: '30-min-meeting' },
    update: {},
    create: {
      title: '30 min meeting',
      description: 'Quick catch up or intro call.',
      durationMinutes: 30,
      slug: '30-min-meeting',
      visibility: 'PUBLIC',
      userId: user.id
    }
  });

  const sixtyMin = await prisma.eventType.upsert({
    where: { slug: '60-min-meeting' },
    update: {},
    create: {
      title: '60 min deep dive',
      description: 'Longer conversation or interview.',
      durationMinutes: 60,
      slug: '60-min-meeting',
      visibility: 'PUBLIC',
      userId: user.id
    }
  });

  // Weekly availability Monday–Friday, 9:00–17:00 UTC
  const weekdays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

  for (const dayOfWeek of weekdays) {
    await prisma.availability.create({
      data: {
        userId: user.id,
        dayOfWeek,
        startTime: 9 * 60,
        endTime: 17 * 60,
        isActive: true,
        timeZone: 'UTC'
      }
    });
  }

  // A couple of sample bookings in the future
  const today = new Date();
  const futureDate = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
  futureDate.setUTCHours(9, 0, 0, 0);

  await prisma.booking.create({
    data: {
      eventTypeId: thirtyMin.id,
      hostId: user.id,
      guestEmail: 'guest1@example.com',
      guestName: 'Guest One',
      status: 'CONFIRMED',
      startTime: futureDate,
      endTime: new Date(futureDate.getTime() + thirtyMin.durationMinutes * 60000),
      hostTimeZone: user.timeZone
    }
  });

  const futureDate2 = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
  futureDate2.setUTCHours(10, 0, 0, 0);

  await prisma.booking.create({
    data: {
      eventTypeId: sixtyMin.id,
      hostId: user.id,
      guestEmail: 'guest2@example.com',
      guestName: 'Guest Two',
      status: 'CONFIRMED',
      startTime: futureDate2,
      endTime: new Date(futureDate2.getTime() + sixtyMin.durationMinutes * 60000),
      hostTimeZone: user.timeZone
    }
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

