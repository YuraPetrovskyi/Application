<div align="right">
  🌐 <a href="README.uk.md">Читати українською</a>
</div>

# Event Management System

A full-stack event management application where users can discover, create, and join events.

🚀 **Live Demo:** [application-indol-ten.vercel.app](https://application-indol-ten.vercel.app)

> Demo accounts: `alice@example.com` / `password123` or `bob@example.com` / `password123`

---

## Features

- **Authentication** — Register and log in with JWT-based auth
- **Security** — HTTP security headers (helmet), rate limiting on auth and AI endpoints
- **Events** — Create, edit, delete events with title, description, date, location, capacity and visibility
- **Tags** — Attach color-coded tags to events; filter and search by tag
- **Discover** — Browse all upcoming public events (past events filtered out)
- **My Events** — View events you've created or joined in a custom calendar (Month / Week / Day / Agenda / Year views)
- **Join / Leave** — Join or leave any public event
- **Pagination** — Configurable events per page (6 / 12 / 24), URL-synced page number, preferences persisted in localStorage
- **AI Assistant** — Chat with an AI assistant (Groq llama-3.3-70b) about your events and public events
- **Seed data** — On first run, the database is automatically populated with demo users and events

---

## Tech Stack

| Layer     | Technology                                                          |
| --------- | ------------------------------------------------------------------- |
| Frontend  | React 18, TypeScript, Vite, Tailwind CSS v4, Redux Toolkit, Zustand |
| Backend   | NestJS, TypeScript, Prisma ORM, Passport JWT, Groq SDK              |
| Database  | PostgreSQL 16                                                       |
| DevOps    | Docker, docker-compose                                              |
| Storybook | Component documentation and visual testing                          |

---

## Getting Started

### Option 1: Docker (recommended)

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.

**1. Clone the repository**

```bash
git clone <repository-url>
cd Application
```

**2. Create environment file**

```bash
cp .env.example .env
```

Open `.env` and set a secure value for `JWT_SECRET`. Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Then paste the result:

```env
JWT_SECRET="paste-generated-value-here"
```

**3. Start the application**

```bash
docker compose up --build
```

On first run this will:

- Pull and start a PostgreSQL container
- Build and start the backend (runs migrations + seeds demo data)
- Build and start the frontend

| Service      | URL                            |
| ------------ | ------------------------------ |
| Frontend     | http://localhost:5173          |
| Backend API  | http://localhost:3000          |
| Swagger Docs | http://localhost:3000/api/docs |

**Demo accounts (auto-seeded):**
| Email | Password |
|-------------------|-------------|
| alice@example.com | password123 |
| bob@example.com | password123 |

**Stop containers:**

```bash
# Stop and keep data
docker compose down

# Stop and wipe all data
docker compose down -v
```

---

### Option 2: Local Development

**Prerequisites:** Node.js 20+, PostgreSQL running locally.

**1. Install dependencies**

```bash
cd backend && npm install
cd ../frontend && npm install
```

**2. Configure environment**

Copy manually or use the command (macOS/Linux/Git Bash):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Open `backend/.env` and set your PostgreSQL password and a secure `JWT_SECRET`.

**3. Set up the database**

```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

**4. Start both servers**

```bash
# Terminal 1 — backend
cd backend && npm run start:dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

---

## Environment Variables

| Variable            | Description                                         | Default                 |
| ------------------- | --------------------------------------------------- | ----------------------- |
| `POSTGRES_USER`     | PostgreSQL username                                 | `postgres`              |
| `POSTGRES_PASSWORD` | PostgreSQL password                                 | `postgres`              |
| `POSTGRES_DB`       | Database name                                       | `event_management`      |
| `DATABASE_URL`      | Full PostgreSQL connection string                   | —                       |
| `JWT_SECRET`        | Secret key for signing JWT tokens                   | —                       |
| `JWT_EXPIRES_IN`    | JWT token expiry                                    | `7d`                    |
| `PORT`              | Backend server port                                 | `3000`                  |
| `FRONTEND_URL`      | Frontend origin allowed by CORS (backend uses this) | `http://localhost:5173` |
| `VITE_API_URL`      | Backend URL used by the frontend                    | `http://localhost:3000` |

---

## API Endpoints

### Auth

| Method | Endpoint         | Description                 |
| ------ | ---------------- | --------------------------- |
| POST   | `/auth/register` | Register a new user         |
| POST   | `/auth/login`    | Login and receive JWT token |

### Events

| Method | Endpoint            | Auth | Description                  |
| ------ | ------------------- | ---- | ---------------------------- |
| GET    | `/events`           | No   | Get all public events        |
| GET    | `/events/:id`       | No   | Get event by ID              |
| POST   | `/events`           | Yes  | Create a new event           |
| PATCH  | `/events/:id`       | Yes  | Update an event (owner only) |
| DELETE | `/events/:id`       | Yes  | Delete an event (owner only) |
| POST   | `/events/:id/join`  | Yes  | Join an event                |
| POST   | `/events/:id/leave` | Yes  | Leave an event               |

### Users

| Method | Endpoint           | Auth | Description                                  |
| ------ | ------------------ | ---- | -------------------------------------------- |
| GET    | `/users/me`        | Yes  | Get current user profile                     |
| GET    | `/users/me/events` | Yes  | Get events created or joined by current user |

### Tags

| Method | Endpoint    | Auth | Description      |
| ------ | ----------- | ---- | ---------------- |
| GET    | `/tags`     | No   | Get all tags     |
| POST   | `/tags`     | Yes  | Create a new tag |
| DELETE | `/tags/:id` | Yes  | Delete a tag     |

### AI Assistant

| Method | Endpoint  | Auth | Description                                         |
| ------ | --------- | ---- | --------------------------------------------------- |
| POST   | `/ai/ask` | Yes  | Ask a question about your events (Groq LLM backend) |

---

## Project Structure

```
Application/
├── backend/                        # NestJS REST API
│   ├── prisma/
│   │   ├── schema.prisma           ← DB schema: User, Event, EventParticipant
│   │   ├── migrations/             ← auto-generated SQL migrations
│   │   └── seed.ts                 ← demo data (2 users, 50 events)
│   └── src/
│       ├── auth/                   ← POST /auth/register, POST /auth/login
│       │   ├── dto/auth.dto.ts     ← RegisterDto, LoginDto (class-validator)
│       │   ├── auth.service.ts     ← bcrypt hashing, JWT signing
│       │   ├── auth.controller.ts
│       │   ├── jwt.strategy.ts     ← validates Bearer token on each request
│       │   ├── jwt-auth.guard.ts   ← protects private endpoints
│       │   └── optional-jwt-auth.guard.ts  ← passes user if token present
│       ├── events/                 ← CRUD + join/leave
│       │   ├── dto/event.dto.ts    ← CreateEventDto, UpdateEventDto
│       │   ├── events.service.ts   ← business logic, Prisma queries
│       │   └── events.controller.ts
│       ├── tags/                   ← GET/POST/DELETE /tags
│       │   ├── dto/tag.dto.ts
│       │   ├── tags.service.ts
│       │   └── tags.controller.ts
│       ├── ai/                     ← POST /ai/ask (Groq LLM)
│       │   ├── ai.service.ts       ← buildContext() + Groq chat completion
│       │   └── ai.controller.ts
│       ├── users/                  ← GET /users/me, GET /users/me/events
│       ├── prisma/                 ← PrismaService (global DB client)
│       ├── app.module.ts
│       └── main.ts                 ← Swagger /api/docs, ValidationPipe, CORS
├── frontend/                       # React 18 + Vite SPA
│   ├── .storybook/                 ← Storybook configuration
│   └── src/
│       ├── api/axios.ts            ← Axios instance with JWT interceptor
│       ├── store/
│       │   ├── slices/authSlice.ts     ← login, register, fetchMe (Redux)
│       │   ├── slices/eventsSlice.ts   ← events CRUD, join/leave (Redux)
│       │   ├── slices/tagsSlice.ts     ← tags list (Redux)
│       │   └── useUIStore.ts           ← UI preferences: per-page, calendar, assistant (Zustand + persist)
│       ├── pages/
│       │   ├── LoginPage           ← /login
│       │   ├── RegisterPage        ← /register
│       │   ├── EventsListPage      ← / (public events, upcoming only)
│       │   ├── EventDetailsPage    ← /events/:id
│       │   ├── CreateEventPage     ← /events/create
│       │   ├── EditEventPage       ← /events/:id/edit
│       │   └── MyEventsPage        ← /my-events (custom calendar)
│       └── components/
│           ├── ai/                     ← AI drawer + floating action button
│           │   ├── AssistantDrawer.tsx   ← AI chat drawer (Zustand state)
│           │   └── AIAssistantFAB.tsx    ← floating action button (logged-in only)
│           ├── calendar/               ← Month, Week, Day, Agenda, Year views
│           ├── events/                 ← event-level UI components
│           │   ├── EventCard.tsx           ← EventCard.stories.tsx
│           │   ├── TagChip.tsx             ← TagChip.stories.tsx
│           │   ├── TagSelector.tsx         ← TagSelector.stories.tsx
│           │   └── ConfirmModal.tsx
│           ├── layout/                 ← app shell
│           │   ├── Navbar.tsx
│           │   └── ProtectedRoute.tsx
│           ├── pagination/             ← pagination controls
│           │   ├── Pagination.tsx          ← Pagination.stories.tsx
│           │   └── PerPageSelector.tsx     ← PerPageSelector.stories.tsx
│           └── ui/                     ← generic reusable components
│               ├── Button.tsx              ← Button.stories.tsx
│               ├── Input.tsx               ← Input.stories.tsx
│               ├── BackButton.tsx          ← BackButton.stories.tsx
│               └── LoadingSpinner.tsx      ← LoadingSpinner.stories.tsx
├── docker-compose.yml              ← postgres + backend + frontend
└── .env.example
```
