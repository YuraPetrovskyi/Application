import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.eventParticipant.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const password = await bcrypt.hash('password123', 10);

  const alice = await prisma.user.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password,
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      password,
    },
  });

  // Create events
  const event1 = await prisma.event.create({
    data: {
      title: 'Tech Conference 2026',
      description:
        'Join us for a day of talks from top engineers about the latest in web development, cloud computing, and AI.',
      dateTime: new Date('2026-06-15T10:00:00.000Z'),
      location: 'Kyiv, Ukraine — UNIT.City',
      capacity: 150,
      visibility: 'PUBLIC',
      organizerId: alice.id,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'React & Node.js Workshop',
      description:
        'Hands-on workshop covering React 18 patterns, NestJS architecture, and best practices for full-stack TypeScript development.',
      dateTime: new Date('2026-07-20T09:00:00.000Z'),
      location: 'Lviv, Ukraine — Leopolis Hotel',
      capacity: 40,
      visibility: 'PUBLIC',
      organizerId: bob.id,
    },
  });

  const event3 = await prisma.event.create({
    data: {
      title: 'Open Source Hackathon',
      description:
        'A 24-hour hackathon focused on contributing to open source projects. Food, prizes, and networking included!',
      dateTime: new Date('2026-08-05T08:00:00.000Z'),
      location: 'Online (Discord + GitHub)',
      capacity: null,
      visibility: 'PUBLIC',
      organizerId: alice.id,
    },
  });

  // Add participants
  await prisma.eventParticipant.create({
    data: { userId: bob.id, eventId: event1.id },
  });

  await prisma.eventParticipant.create({
    data: { userId: alice.id, eventId: event2.id },
  });

  console.log('✅ Seed completed!');
  console.log(`   - 2 users created (alice@example.com, bob@example.com)`);
  console.log(`   - 3 public events created`);
  console.log(`   - password for both users: password123`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
