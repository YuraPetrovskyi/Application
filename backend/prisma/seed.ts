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
  // 1. Always upsert predefined tags
  const tags: Record<string, string> = {};
  for (const name of PREDEFINED_TAGS) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    tags[name] = tag.id;
  }

  // 2. Create demo users + 3 initial events if first run
  let alice: { id: string } | null = null;
  let bob: { id: string } | null = null;

  const userCount = await prisma.user.count();
  if (userCount === 0) {
    console.log('Seeding database...');

    await prisma.eventParticipant.deleteMany();
    await prisma.eventTag.deleteMany();
    await prisma.event.deleteMany();
    await prisma.user.deleteMany();

    const password = await bcrypt.hash('password123', 10);

    alice = await prisma.user.create({
      data: { name: 'Alice Johnson', email: 'alice@example.com', password },
    });
    bob = await prisma.user.create({
      data: { name: 'Bob Smith', email: 'bob@example.com', password },
    });

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

    await prisma.eventParticipant.create({
      data: { userId: bob.id, eventId: event1.id },
    });
    await prisma.eventParticipant.create({
      data: { userId: alice.id, eventId: event2.id },
    });

    console.log('✅ Users and initial events seeded');
    console.log(
      '   - 2 users: alice@example.com, bob@example.com (password: password123)',
    );
    console.log('   - 3 initial events with tags');
    // suppress unused variable warnings
    void event3;
  } else {
    console.log('Users already exist, skipping initial seed...');
    alice = await prisma.user.findUnique({
      where: { email: 'alice@example.com' },
    });
    bob = await prisma.user.findUnique({ where: { email: 'bob@example.com' } });
  }

  if (!alice || !bob) {
    console.log('Demo users not found, cannot add extra events.');
    return;
  }

  // 3. Add extra events if fewer than 50 total events exist
  const eventCount = await prisma.event.count();
  if (eventCount >= 50) {
    console.log(
      `Events already seeded (${eventCount} events), skipping extra events.`,
    );
    console.log('Seed completed!');
    return;
  }

  console.log(`Adding extra events (current: ${eventCount})...`);

  interface EventConfig {
    title: string;
    desc: string;
    date: string;
    loc: string;
    cap: number | null;
    tags: string[];
    org: 'alice' | 'bob';
  }

  const extraEvents: EventConfig[] = [
    // Tech (15)
    {
      title: 'Mobile Dev Summit',
      desc: 'A deep dive into iOS, Android, and cross-platform development with React Native and Flutter.',
      date: '2026-04-10T10:00:00Z',
      loc: 'Kyiv, Ukraine — Parkovy Convention Center',
      cap: 200,
      tags: ['Tech'],
      org: 'alice',
    },
    {
      title: 'AI & Machine Learning Conference',
      desc: 'Industry leaders share insights on LLMs, neural networks, and the future of artificial intelligence.',
      date: '2026-04-25T09:00:00Z',
      loc: 'Online',
      cap: 500,
      tags: ['Tech', 'Science'],
      org: 'bob',
    },
    {
      title: 'DevOps Days Ukraine',
      desc: 'Two days of talks and workshops covering CI/CD pipelines, infrastructure as code, and platform engineering.',
      date: '2026-05-12T09:00:00Z',
      loc: 'Kharkiv, Ukraine — Kharkiv IT Cluster',
      cap: 150,
      tags: ['Tech'],
      org: 'alice',
    },
    {
      title: 'Frontend Masters Workshop',
      desc: 'Advanced React patterns, performance optimization, and modern CSS techniques in one intensive day.',
      date: '2026-05-20T10:00:00Z',
      loc: 'Lviv, Ukraine — IT Arena Hub',
      cap: 30,
      tags: ['Tech', 'Education'],
      org: 'bob',
    },
    {
      title: 'Cybersecurity Forum 2026',
      desc: 'Security professionals discuss threat intelligence, zero-trust architecture, and ethical hacking.',
      date: '2026-06-05T09:00:00Z',
      loc: 'Kyiv, Ukraine — UNIT.City',
      cap: 250,
      tags: ['Tech', 'Science'],
      org: 'alice',
    },
    {
      title: 'Startup Pitch Night',
      desc: 'Ten early-stage startups pitch to investors for a chance at pre-seed funding. Networking reception follows.',
      date: '2026-06-18T18:00:00Z',
      loc: 'Dnipro, Ukraine — Fabrika Space',
      cap: 100,
      tags: ['Tech', 'Business'],
      org: 'bob',
    },
    {
      title: 'Cloud Computing Summit',
      desc: 'Exploring AWS, Google Cloud, and Azure architectures for scalable modern applications.',
      date: '2026-07-08T10:00:00Z',
      loc: 'Online',
      cap: null,
      tags: ['Tech', 'Science'],
      org: 'alice',
    },
    {
      title: 'Python Workshop for Beginners',
      desc: 'Hands-on introduction to Python programming — from basics to building your first web scraper.',
      date: '2026-07-15T10:00:00Z',
      loc: 'Lviv, Ukraine — IT Arena Hub',
      cap: 25,
      tags: ['Tech', 'Education'],
      org: 'bob',
    },
    {
      title: 'Web3 & Blockchain Meetup',
      desc: 'Developers and entrepreneurs discuss decentralized applications, smart contracts, and DeFi protocols.',
      date: '2026-08-12T18:30:00Z',
      loc: 'Kyiv, Ukraine — Closer Club',
      cap: 80,
      tags: ['Tech', 'Business'],
      org: 'alice',
    },
    {
      title: 'Game Development Jam',
      desc: '48-hour game jam — solo or team. Build a game from scratch and win prizes for creativity and execution.',
      date: '2026-08-22T10:00:00Z',
      loc: 'Online',
      cap: null,
      tags: ['Tech', 'Art'],
      org: 'bob',
    },
    {
      title: 'IoT Innovations Forum',
      desc: 'Showcasing the latest in connected devices, smart home tech, and industrial IoT applications.',
      date: '2026-09-10T09:00:00Z',
      loc: 'Kharkiv, Ukraine — KhTZ Innovation Hub',
      cap: 120,
      tags: ['Tech', 'Science'],
      org: 'alice',
    },
    {
      title: 'React Native Masterclass',
      desc: 'Build production-grade cross-platform apps. Topics: advanced navigation, native modules, and performance.',
      date: '2026-09-18T10:00:00Z',
      loc: 'Kyiv, Ukraine — WeWork Parkovy',
      cap: 35,
      tags: ['Tech', 'Education'],
      org: 'bob',
    },
    {
      title: 'Data Science Bootcamp',
      desc: 'Intensive 3-day program covering pandas, scikit-learn, visualization, and deploying ML models.',
      date: '2026-10-05T09:00:00Z',
      loc: 'Online',
      cap: 50,
      tags: ['Tech', 'Science', 'Education'],
      org: 'alice',
    },
    {
      title: 'Open Source Summit',
      desc: 'Celebrating open source culture — talks from maintainers of popular projects, contribution workshops.',
      date: '2026-10-20T09:00:00Z',
      loc: 'Lviv, Ukraine — Palace of Arts',
      cap: 300,
      tags: ['Tech'],
      org: 'bob',
    },
    {
      title: 'Tech Leadership Forum',
      desc: 'CTOs and engineering managers share strategies for scaling teams, managing technical debt, and hiring.',
      date: '2026-11-08T09:00:00Z',
      loc: 'Kyiv, Ukraine — InterContinental Hotel',
      cap: 180,
      tags: ['Tech', 'Business'],
      org: 'alice',
    },
    // Business (8)
    {
      title: "Entrepreneurs' Breakfast",
      desc: 'Monthly breakfast meetup for founders to share challenges, celebrate wins, and build partnerships.',
      date: '2026-04-07T08:30:00Z',
      loc: 'Kyiv, Ukraine — Tarelka Café',
      cap: 60,
      tags: ['Business'],
      org: 'bob',
    },
    {
      title: 'Digital Marketing Conference',
      desc: 'SEO, content marketing, paid ads, and growth hacking strategies from top Ukrainian marketers.',
      date: '2026-05-05T09:00:00Z',
      loc: 'Odessa, Ukraine — Odessa Business Center',
      cap: 200,
      tags: ['Business'],
      org: 'alice',
    },
    {
      title: 'Investor Connect Day',
      desc: 'Curated networking event connecting founders with VCs, angel investors, and startup accelerators.',
      date: '2026-06-15T10:00:00Z',
      loc: 'Kyiv, Ukraine — Unit.City Stage',
      cap: 150,
      tags: ['Business'],
      org: 'bob',
    },
    {
      title: 'E-commerce Summit Ukraine',
      desc: 'Insights from top Ukrainian online retailers on logistics, customer acquisition, and platform growth.',
      date: '2026-07-02T09:00:00Z',
      loc: 'Online',
      cap: null,
      tags: ['Business'],
      org: 'alice',
    },
    {
      title: 'Finance & Fintech Forum',
      desc: 'Banks, neobanks, and fintech startups discuss open banking, crypto regulation, and financial inclusion.',
      date: '2026-08-05T09:00:00Z',
      loc: 'Kyiv, Ukraine — Hilton Hotel',
      cap: 200,
      tags: ['Business', 'Tech'],
      org: 'bob',
    },
    {
      title: 'HR & People Summit',
      desc: 'Modern talent acquisition, remote team management, and employee wellbeing in the age of hybrid work.',
      date: '2026-09-03T09:00:00Z',
      loc: 'Lviv, Ukraine — Leopolis Hotel',
      cap: 100,
      tags: ['Business', 'Education'],
      org: 'alice',
    },
    {
      title: 'Product Management Meetup',
      desc: 'PMs share frameworks for roadmap prioritization, user research, and cross-functional collaboration.',
      date: '2026-10-14T18:30:00Z',
      loc: 'Kyiv, Ukraine — Platforma Hub',
      cap: 80,
      tags: ['Business', 'Tech'],
      org: 'bob',
    },
    {
      title: 'Export & International Business Forum',
      desc: 'Tools and strategies for Ukrainian businesses expanding to EU and global markets.',
      date: '2026-11-20T09:00:00Z',
      loc: 'Odessa, Ukraine — Port Conference Center',
      cap: 250,
      tags: ['Business'],
      org: 'alice',
    },
    // Art (7)
    {
      title: 'Contemporary Art Exhibition',
      desc: 'Works from 30 emerging Ukrainian artists exploring identity, war, and digital culture.',
      date: '2026-04-15T11:00:00Z',
      loc: 'Lviv, Ukraine — Dzyga Art Center',
      cap: 300,
      tags: ['Art'],
      org: 'bob',
    },
    {
      title: 'Street Art Festival',
      desc: 'Live murals, graffiti battles, and urban art installations across the city center.',
      date: '2026-05-16T10:00:00Z',
      loc: 'Kyiv, Ukraine — Podil District',
      cap: null,
      tags: ['Art'],
      org: 'alice',
    },
    {
      title: 'Photography Workshop',
      desc: 'Master portrait and street photography — composition, lighting, and post-processing in Lightroom.',
      date: '2026-06-10T10:00:00Z',
      loc: 'Online',
      cap: 40,
      tags: ['Art', 'Education'],
      org: 'bob',
    },
    {
      title: 'Digital Art & Creative Tech Summit',
      desc: 'Where creativity meets technology — generative art, AI-assisted design, and immersive installations.',
      date: '2026-07-20T10:00:00Z',
      loc: 'Kyiv, Ukraine — Mystetsky Arsenal',
      cap: 120,
      tags: ['Art', 'Tech'],
      org: 'alice',
    },
    {
      title: 'Illustration Masterclass',
      desc: 'Professional illustrator walks through concept development, digital tools, and building a portfolio.',
      date: '2026-08-18T10:00:00Z',
      loc: 'Lviv, Ukraine — Staryi Rynok Studio',
      cap: 20,
      tags: ['Art', 'Education'],
      org: 'bob',
    },
    {
      title: 'Film Screening Night',
      desc: 'Curated showcase of short films by independent Ukrainian directors, followed by a Q&A panel.',
      date: '2026-09-25T19:00:00Z',
      loc: 'Odessa, Ukraine — Odessa Film Studio',
      cap: 150,
      tags: ['Art'],
      org: 'alice',
    },
    {
      title: 'Graphic Design Conference',
      desc: 'Typography, branding, UI trends, and the business of design from award-winning studios.',
      date: '2026-10-28T09:00:00Z',
      loc: 'Online',
      cap: null,
      tags: ['Art', 'Business'],
      org: 'bob',
    },
    // Music (7)
    {
      title: 'Indie Music Festival',
      desc: 'Three stages, 20 acts, two days of the best Ukrainian indie, folk, and alternative music.',
      date: '2026-04-20T14:00:00Z',
      loc: 'Kyiv, Ukraine — Atlas Weekend Park',
      cap: null,
      tags: ['Music', 'Art'],
      org: 'alice',
    },
    {
      title: 'Jazz Night Lviv',
      desc: 'An intimate evening of live jazz featuring a quartet from Kyiv and a guest pianist from Warsaw.',
      date: '2026-05-09T20:00:00Z',
      loc: 'Lviv, Ukraine — Rock Café',
      cap: 200,
      tags: ['Music'],
      org: 'bob',
    },
    {
      title: 'Electronic Music Production Workshop',
      desc: 'From Ableton basics to sound design and mastering — a hands-on session for aspiring producers.',
      date: '2026-06-22T14:00:00Z',
      loc: 'Online',
      cap: 30,
      tags: ['Music', 'Tech'],
      org: 'alice',
    },
    {
      title: 'Classical Concert Series',
      desc: 'The Odessa Philharmonic performs Beethoven, Rachmaninoff, and a world premiere by a Ukrainian composer.',
      date: '2026-07-25T19:00:00Z',
      loc: 'Odessa, Ukraine — Odessa Opera Theater',
      cap: 400,
      tags: ['Music', 'Art'],
      org: 'bob',
    },
    {
      title: 'Singer-Songwriter Showcase',
      desc: 'Eight emerging artists perform original songs. Audience vote decides who wins studio recording time.',
      date: '2026-08-30T18:00:00Z',
      loc: 'Kyiv, Ukraine — Caribbean Club',
      cap: 100,
      tags: ['Music'],
      org: 'alice',
    },
    {
      title: 'Music Business Summit',
      desc: 'Music industry professionals discuss streaming economics, sync licensing, and artist monetization.',
      date: '2026-09-15T10:00:00Z',
      loc: 'Online',
      cap: 200,
      tags: ['Music', 'Business'],
      org: 'bob',
    },
    {
      title: 'Choir & Choral Festival',
      desc: 'Nine choirs from across Ukraine and Poland perform a program of folk, sacred, and contemporary music.',
      date: '2026-10-10T15:00:00Z',
      loc: 'Kharkiv, Ukraine — Kharkiv Philharmonic',
      cap: null,
      tags: ['Music', 'Art'],
      org: 'alice',
    },
    // Sport (6)
    {
      title: 'Kyiv Spring Half Marathon',
      desc: "Race through Kyiv's scenic riverside parks. Categories for all levels — 5km, 10km, and 21km.",
      date: '2026-04-05T08:00:00Z',
      loc: 'Kyiv, Ukraine — Hydropark',
      cap: 2000,
      tags: ['Sport', 'Health'],
      org: 'bob',
    },
    {
      title: 'Beach Volleyball Tournament',
      desc: "Open amateur tournament on Odessa's Black Sea beach. Teams of 2. Registration includes BBQ dinner.",
      date: '2026-06-28T09:00:00Z',
      loc: 'Odessa, Ukraine — Lanzheron Beach',
      cap: 200,
      tags: ['Sport'],
      org: 'alice',
    },
    {
      title: 'CrossFit Team Challenge',
      desc: 'Four-person teams compete in five WODs over one day. All fitness levels welcome.',
      date: '2026-07-11T08:00:00Z',
      loc: 'Dnipro, Ukraine — Atleta CrossFit Box',
      cap: 100,
      tags: ['Sport', 'Health'],
      org: 'bob',
    },
    {
      title: 'Carpathian Trail Running Camp',
      desc: 'Three days of guided trail runs in the Carpathian mountains with coaching and recovery workshops.',
      date: '2026-08-15T08:00:00Z',
      loc: 'Lviv region, Ukraine — Slavske',
      cap: 60,
      tags: ['Sport', 'Health'],
      org: 'alice',
    },
    {
      title: 'Corporate Football Tournament',
      desc: 'Friendly five-a-side football tournament for tech companies. Prizes, jerseys, and post-match party.',
      date: '2026-09-20T10:00:00Z',
      loc: 'Kyiv, Ukraine — Olympic Training Center',
      cap: 300,
      tags: ['Sport'],
      org: 'bob',
    },
    {
      title: 'Cycling Charity Ride',
      desc: "50km charity ride raising funds for children's hospitals. Professional pacemakers and route support.",
      date: '2026-10-17T08:00:00Z',
      loc: 'Kyiv, Ukraine — Vyshhorod Route',
      cap: null,
      tags: ['Sport', 'Health'],
      org: 'alice',
    },
    // Education (7)
    {
      title: 'Science Fair for Kids & Parents',
      desc: 'Interactive exhibits, experiments, and workshops exploring physics, chemistry, and biology for all ages.',
      date: '2026-04-28T10:00:00Z',
      loc: 'Lviv, Ukraine — Lviv Polytechnic',
      cap: 200,
      tags: ['Education', 'Science'],
      org: 'bob',
    },
    {
      title: 'Creative Writing Workshop',
      desc: 'Develop your storytelling skills — character development, plot structure, and writing daily habits.',
      date: '2026-05-25T14:00:00Z',
      loc: 'Online',
      cap: 50,
      tags: ['Education', 'Art'],
      org: 'alice',
    },
    {
      title: 'Language Exchange Meetup',
      desc: 'Practice English, Ukrainian, Polish, or German with native speakers in casual conversation pairs.',
      date: '2026-06-30T18:00:00Z',
      loc: 'Kyiv, Ukraine — British Council Center',
      cap: 40,
      tags: ['Education'],
      org: 'bob',
    },
    {
      title: 'TEDx Kyiv 2026',
      desc: 'Ten remarkable speakers across science, culture, technology, and social impact. Ideas worth spreading.',
      date: '2026-07-17T09:00:00Z',
      loc: 'Kyiv, Ukraine — Kyiv-Mohyla Academy',
      cap: 500,
      tags: ['Education', 'Science'],
      org: 'alice',
    },
    {
      title: 'Ukrainian History Lecture Series',
      desc: 'Six-lecture series by leading historians covering Ukraine from Kievan Rus to the present day.',
      date: '2026-08-25T18:00:00Z',
      loc: 'Online',
      cap: null,
      tags: ['Education'],
      org: 'bob',
    },
    {
      title: 'Public Speaking Workshop',
      desc: 'Overcome stage fright and master storytelling, persuasion, and delivery for professional settings.',
      date: '2026-09-08T10:00:00Z',
      loc: 'Lviv, Ukraine — Citadel Inn',
      cap: 30,
      tags: ['Education', 'Business'],
      org: 'alice',
    },
    {
      title: 'Philosophy & Ethics Forum',
      desc: 'Discussions on moral philosophy, AI ethics, and the meaning of justice in contemporary society.',
      date: '2026-11-03T14:00:00Z',
      loc: 'Kyiv, Ukraine — Taras Shevchenko University',
      cap: 100,
      tags: ['Education', 'Science'],
      org: 'bob',
    },
  ];

  for (const e of extraEvents) {
    await prisma.event.create({
      data: {
        title: e.title,
        description: e.desc,
        dateTime: new Date(e.date),
        location: e.loc,
        capacity: e.cap,
        visibility: 'PUBLIC',
        organizerId: e.org === 'bob' ? bob.id : alice.id,
        tags: {
          create: e.tags.map((name) => ({
            tag: { connect: { id: tags[name] } },
          })),
        },
      },
    });
  }

  console.log(`✅ Added ${extraEvents.length} extra events`);
  console.log(
    `✅ Seed completed! Total events: ${eventCount + extraEvents.length}`,
  );
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
