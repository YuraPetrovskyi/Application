-- =============================================================================
-- Extra events seed — run this in DBeaver / pgAdmin / psql to populate the DB.
-- Requires: alice@example.com and bob@example.com users + predefined tags exist.
-- Safe to run multiple times: skips if events count is already >= 50.
-- =============================================================================

DO $$
DECLARE
  alice_id      TEXT;
  bob_id        TEXT;
  tag_tech      TEXT;
  tag_art       TEXT;
  tag_business  TEXT;
  tag_music     TEXT;
  tag_science   TEXT;
  tag_sport     TEXT;
  tag_education TEXT;
  tag_health    TEXT;
  ev            TEXT;
  cnt           INT;
BEGIN
  -- Guard: skip if already seeded
  SELECT COUNT(*) INTO cnt FROM "Event";
  IF cnt >= 50 THEN
    RAISE NOTICE 'Already % events — nothing to insert.', cnt;
    RETURN;
  END IF;

  -- Users
  SELECT id INTO alice_id FROM "User" WHERE email = 'alice@example.com';
  SELECT id INTO bob_id   FROM "User" WHERE email = 'bob@example.com';
  IF alice_id IS NULL OR bob_id IS NULL THEN
    RAISE EXCEPTION 'Demo users not found. Run the initial seed first.';
  END IF;

  -- Tags
  SELECT id INTO tag_tech      FROM "Tag" WHERE name = 'Tech';
  SELECT id INTO tag_art       FROM "Tag" WHERE name = 'Art';
  SELECT id INTO tag_business  FROM "Tag" WHERE name = 'Business';
  SELECT id INTO tag_music     FROM "Tag" WHERE name = 'Music';
  SELECT id INTO tag_science   FROM "Tag" WHERE name = 'Science';
  SELECT id INTO tag_sport     FROM "Tag" WHERE name = 'Sport';
  SELECT id INTO tag_education FROM "Tag" WHERE name = 'Education';
  SELECT id INTO tag_health    FROM "Tag" WHERE name = 'Health';

  -- ── TECH (15) ──────────────────────────────────────────────────────────────

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Mobile Dev Summit','A deep dive into iOS, Android, and cross-platform development with React Native and Flutter.',
    '2026-04-10 10:00:00+00','Kyiv, Ukraine — Parkovy Convention Center',200,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_tech);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'AI & Machine Learning Conference','Industry leaders share insights on LLMs, neural networks, and the future of artificial intelligence.',
    '2026-04-25 09:00:00+00','Online',500,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_tech),(ev,tag_science);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'DevOps Days Ukraine','Two days of talks and workshops covering CI/CD pipelines, infrastructure as code, and platform engineering.',
    '2026-05-12 09:00:00+00','Kharkiv, Ukraine — Kharkiv IT Cluster',150,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_tech);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Frontend Masters Workshop','Advanced React patterns, performance optimization, and modern CSS techniques in one intensive day.',
    '2026-05-20 10:00:00+00','Lviv, Ukraine — IT Arena Hub',30,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_tech),(ev,tag_education);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Cybersecurity Forum 2026','Security professionals discuss threat intelligence, zero-trust architecture, and ethical hacking.',
    '2026-06-05 09:00:00+00','Kyiv, Ukraine — UNIT.City',250,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_tech),(ev,tag_science);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Startup Pitch Night','Ten early-stage startups pitch to investors for a chance at pre-seed funding. Networking reception follows.',
    '2026-06-18 18:00:00+00','Dnipro, Ukraine — Fabrika Space',100,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_tech),(ev,tag_business);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Cloud Computing Summit','Exploring AWS, Google Cloud, and Azure architectures for scalable modern applications.',
    '2026-07-08 10:00:00+00','Online',NULL,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_tech),(ev,tag_science);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Python Workshop for Beginners','Hands-on introduction to Python programming — from basics to building your first web scraper.',
    '2026-07-15 10:00:00+00','Lviv, Ukraine — IT Arena Hub',25,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_tech),(ev,tag_education);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Web3 & Blockchain Meetup','Developers and entrepreneurs discuss decentralized applications, smart contracts, and DeFi protocols.',
    '2026-08-12 18:30:00+00','Kyiv, Ukraine — Closer Club',80,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_tech),(ev,tag_business);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Game Development Jam','48-hour game jam — solo or team. Build a game from scratch and win prizes for creativity and execution.',
    '2026-08-22 10:00:00+00','Online',NULL,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_tech),(ev,tag_art);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'IoT Innovations Forum','Showcasing the latest in connected devices, smart home tech, and industrial IoT applications.',
    '2026-09-10 09:00:00+00','Kharkiv, Ukraine — KhTZ Innovation Hub',120,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_tech),(ev,tag_science);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'React Native Masterclass','Build production-grade cross-platform apps. Topics: advanced navigation, native modules, and performance.',
    '2026-09-18 10:00:00+00','Kyiv, Ukraine — WeWork Parkovy',35,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_tech),(ev,tag_education);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Data Science Bootcamp','Intensive 3-day program covering pandas, scikit-learn, visualization, and deploying ML models.',
    '2026-10-05 09:00:00+00','Online',50,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_tech),(ev,tag_science),(ev,tag_education);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Open Source Summit','Celebrating open source culture — talks from maintainers of popular projects, contribution workshops.',
    '2026-10-20 09:00:00+00','Lviv, Ukraine — Palace of Arts',300,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_tech);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Tech Leadership Forum','CTOs and engineering managers share strategies for scaling teams, managing technical debt, and hiring.',
    '2026-11-08 09:00:00+00','Kyiv, Ukraine — InterContinental Hotel',180,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_tech),(ev,tag_business);

  -- ── BUSINESS (8) ───────────────────────────────────────────────────────────

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Entrepreneurs'' Breakfast','Monthly breakfast meetup for founders to share challenges, celebrate wins, and build partnerships.',
    '2026-04-07 08:30:00+00','Kyiv, Ukraine — Tarelka Café',60,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_business);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Digital Marketing Conference','SEO, content marketing, paid ads, and growth hacking strategies from top Ukrainian marketers.',
    '2026-05-05 09:00:00+00','Odessa, Ukraine — Odessa Business Center',200,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_business);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Investor Connect Day','Curated networking event connecting founders with VCs, angel investors, and startup accelerators.',
    '2026-06-15 10:00:00+00','Kyiv, Ukraine — Unit.City Stage',150,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_business);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'E-commerce Summit Ukraine','Insights from top Ukrainian online retailers on logistics, customer acquisition, and platform growth.',
    '2026-07-02 09:00:00+00','Online',NULL,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_business);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Finance & Fintech Forum','Banks, neobanks, and fintech startups discuss open banking, crypto regulation, and financial inclusion.',
    '2026-08-05 09:00:00+00','Kyiv, Ukraine — Hilton Hotel',200,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_business),(ev,tag_tech);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'HR & People Summit','Modern talent acquisition, remote team management, and employee wellbeing in the age of hybrid work.',
    '2026-09-03 09:00:00+00','Lviv, Ukraine — Leopolis Hotel',100,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_business),(ev,tag_education);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Product Management Meetup','PMs share frameworks for roadmap prioritization, user research, and cross-functional collaboration.',
    '2026-10-14 18:30:00+00','Kyiv, Ukraine — Platforma Hub',80,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_business),(ev,tag_tech);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Export & International Business Forum','Tools and strategies for Ukrainian businesses expanding to EU and global markets.',
    '2026-11-20 09:00:00+00','Odessa, Ukraine — Port Conference Center',250,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_business);

  -- ── ART (7) ────────────────────────────────────────────────────────────────

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Contemporary Art Exhibition','Works from 30 emerging Ukrainian artists exploring identity, war, and digital culture.',
    '2026-04-15 11:00:00+00','Lviv, Ukraine — Dzyga Art Center',300,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_art);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Street Art Festival','Live murals, graffiti battles, and urban art installations across the city center.',
    '2026-05-16 10:00:00+00','Kyiv, Ukraine — Podil District',NULL,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_art);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Photography Workshop','Master portrait and street photography — composition, lighting, and post-processing in Lightroom.',
    '2026-06-10 10:00:00+00','Online',40,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_art),(ev,tag_education);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Digital Art & Creative Tech Summit','Where creativity meets technology — generative art, AI-assisted design, and immersive installations.',
    '2026-07-20 10:00:00+00','Kyiv, Ukraine — Mystetsky Arsenal',120,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_art),(ev,tag_tech);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Illustration Masterclass','Professional illustrator walks through concept development, digital tools, and building a portfolio.',
    '2026-08-18 10:00:00+00','Lviv, Ukraine — Staryi Rynok Studio',20,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_art),(ev,tag_education);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Film Screening Night','Curated showcase of short films by independent Ukrainian directors, followed by a Q&A panel.',
    '2026-09-25 19:00:00+00','Odessa, Ukraine — Odessa Film Studio',150,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_art);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Graphic Design Conference','Typography, branding, UI trends, and the business of design from award-winning studios.',
    '2026-10-28 09:00:00+00','Online',NULL,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_art),(ev,tag_business);

  -- ── MUSIC (7) ──────────────────────────────────────────────────────────────

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Indie Music Festival','Three stages, 20 acts, two days of the best Ukrainian indie, folk, and alternative music.',
    '2026-04-20 14:00:00+00','Kyiv, Ukraine — Atlas Weekend Park',NULL,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_music),(ev,tag_art);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Jazz Night Lviv','An intimate evening of live jazz featuring a quartet from Kyiv and a guest pianist from Warsaw.',
    '2026-05-09 20:00:00+00','Lviv, Ukraine — Rock Café',200,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_music);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Electronic Music Production Workshop','From Ableton basics to sound design and mastering — a hands-on session for aspiring producers.',
    '2026-06-22 14:00:00+00','Online',30,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_music),(ev,tag_tech);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Classical Concert Series','The Odessa Philharmonic performs Beethoven, Rachmaninoff, and a world premiere by a Ukrainian composer.',
    '2026-07-25 19:00:00+00','Odessa, Ukraine — Odessa Opera Theater',400,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_music),(ev,tag_art);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Singer-Songwriter Showcase','Eight emerging artists perform original songs. Audience vote decides who wins studio recording time.',
    '2026-08-30 18:00:00+00','Kyiv, Ukraine — Caribbean Club',100,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_music);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Music Business Summit','Music industry professionals discuss streaming economics, sync licensing, and artist monetization.',
    '2026-09-15 10:00:00+00','Online',200,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_music),(ev,tag_business);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Choir & Choral Festival','Nine choirs from across Ukraine and Poland perform folk, sacred, and contemporary music.',
    '2026-10-10 15:00:00+00','Kharkiv, Ukraine — Kharkiv Philharmonic',NULL,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_music),(ev,tag_art);

  -- ── SPORT (6) ──────────────────────────────────────────────────────────────

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Kyiv Spring Half Marathon','Race through Kyiv''s scenic riverside parks. Categories for all levels — 5km, 10km, and 21km.',
    '2026-04-05 08:00:00+00','Kyiv, Ukraine — Hydropark',2000,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_sport),(ev,tag_health);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Beach Volleyball Tournament','Open amateur tournament on Odessa''s Black Sea beach. Teams of 2. Registration includes BBQ dinner.',
    '2026-06-28 09:00:00+00','Odessa, Ukraine — Lanzheron Beach',200,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_sport);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'CrossFit Team Challenge','Four-person teams compete in five WODs over one day. All fitness levels welcome.',
    '2026-07-11 08:00:00+00','Dnipro, Ukraine — Atleta CrossFit Box',100,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_sport),(ev,tag_health);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Carpathian Trail Running Camp','Three days of guided trail runs in the Carpathian mountains with coaching and recovery workshops.',
    '2026-08-15 08:00:00+00','Lviv region, Ukraine — Slavske',60,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_sport),(ev,tag_health);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Corporate Football Tournament','Friendly five-a-side football tournament for tech companies. Prizes, jerseys, and post-match party.',
    '2026-09-20 10:00:00+00','Kyiv, Ukraine — Olympic Training Center',300,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_sport);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Cycling Charity Ride','50km charity ride raising funds for children''s hospitals. Professional pacemakers and route support.',
    '2026-10-17 08:00:00+00','Kyiv, Ukraine — Vyshhorod Route',NULL,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_sport),(ev,tag_health);

  -- ── EDUCATION (7) ──────────────────────────────────────────────────────────

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Science Fair for Kids & Parents','Interactive exhibits, experiments, and workshops exploring physics, chemistry, and biology for all ages.',
    '2026-04-28 10:00:00+00','Lviv, Ukraine — Lviv Polytechnic',200,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_education),(ev,tag_science);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Creative Writing Workshop','Develop your storytelling skills — character development, plot structure, and writing daily habits.',
    '2026-05-25 14:00:00+00','Online',50,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_education),(ev,tag_art);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Language Exchange Meetup','Practice English, Ukrainian, Polish, or German with native speakers in casual conversation pairs.',
    '2026-06-30 18:00:00+00','Kyiv, Ukraine — British Council Center',40,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_education);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'TEDx Kyiv 2026','Ten remarkable speakers across science, culture, technology, and social impact. Ideas worth spreading.',
    '2026-07-17 09:00:00+00','Kyiv, Ukraine — Kyiv-Mohyla Academy',500,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_education),(ev,tag_science);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Ukrainian History Lecture Series','Six-lecture series by leading historians covering Ukraine from Kievan Rus to the present day.',
    '2026-08-25 18:00:00+00','Online',NULL,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_education);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Public Speaking Workshop','Overcome stage fright and master storytelling, persuasion, and delivery for professional settings.',
    '2026-09-08 10:00:00+00','Lviv, Ukraine — Citadel Inn',30,'PUBLIC',alice_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_education),(ev,tag_business);

  ev := gen_random_uuid()::TEXT;
  INSERT INTO "Event" (id,title,description,"dateTime",location,capacity,visibility,"organizerId","createdAt","updatedAt")
  VALUES (ev,'Philosophy & Ethics Forum','Discussions on moral philosophy, AI ethics, and the meaning of justice in contemporary society.',
    '2026-11-03 14:00:00+00','Kyiv, Ukraine — Taras Shevchenko University',100,'PUBLIC',bob_id,NOW(),NOW());
  INSERT INTO "EventTag"("eventId","tagId") VALUES (ev,tag_education),(ev,tag_science);

  RAISE NOTICE '✅ Done! 50 events now in database.';
END $$;
