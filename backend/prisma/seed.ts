import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const PREDEFINED_TAGS = [
  'Tech',
  'Art',
  'Business',
  'Music',
  'Science',
  'Sport',
  'Education',
  'Health',
];

async function main() {
  // Always upsert predefined tags
  const tags: Record<string, string> = {};
  for (const name of PREDEFINED_TAGS) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    tags[name] = tag.id;
  }

  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log('Database already seeded, skipping users/events...');
    return;
  }

  console.log('Seeding database...');

  // Clean existing data
  await prisma.eventParticipant.deleteMany();
  await prisma.eventTag.deleteMany();
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
      tags: {
        create: [
          { tag: { connect: { id: tags['Tech'] } } },
          { tag: { connect: { id: tags['Science'] } } },
        ],
      },
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
      tags: {
        create: [
          { tag: { connect: { id: tags['Tech'] } } },
          { tag: { connect: { id: tags['Education'] } } },
        ],
      },
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
      tags: {
        create: [
          { tag: { connect: { id: tags['Tech'] } } },
          { tag: { connect: { id: tags['Business'] } } },
        ],
      },
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
  console.log(`   - 8 tags created: ${PREDEFINED_TAGS.join(', ')}`);
  console.log(`   - 2 users created (alice@example.com, bob@example.com)`);
  console.log(`   - 3 public events created with tags`);
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
