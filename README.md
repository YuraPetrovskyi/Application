<div align="right">
  🌐 <a href="README.uk.md">Читати українською</a>
</div>

# Event Management System

A full-stack event management application where users can discover, create, and join events.

---

## Features

- **Authentication** — Register and log in with JWT-based auth
- **Events** — Create, edit, delete events with title, description, date, location, capacity and visibility
- **Discover** — Browse all upcoming public events (past events filtered out)
- **My Events** — View events you've created or joined in a custom calendar (Month / Week / Day / Agenda / Year views)
- **Join / Leave** — Join or leave any public event
- **Seed data** — On first run, the database is automatically populated with demo users and events

---

## Tech Stack

| Layer    | Technology                                                 |
| -------- | ---------------------------------------------------------- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS v4, Redux Toolkit |
| Backend  | NestJS, TypeScript, Prisma ORM, Passport JWT               |
| Database | PostgreSQL 16                                              |
| DevOps   | Docker, docker-compose                                     |

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

Create `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/event_management"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3000
```

Create `frontend/.env`:

```env
VITE_API_URL="http://localhost:3000"
```

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

| Variable            | Description                       | Default                 |
| ------------------- | --------------------------------- | ----------------------- |
| `POSTGRES_USER`     | PostgreSQL username               | `postgres`              |
| `POSTGRES_PASSWORD` | PostgreSQL password               | `postgres`              |
| `POSTGRES_DB`       | Database name                     | `event_management`      |
| `DATABASE_URL`      | Full PostgreSQL connection string | —                       |
| `JWT_SECRET`        | Secret key for signing JWT tokens | —                       |
| `JWT_EXPIRES_IN`    | JWT token expiry                  | `7d`                    |
| `PORT`              | Backend server port               | `3000`                  |
| `VITE_API_URL`      | Backend URL used by the frontend  | `http://localhost:3000` |

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

---

## Project Structure

```
Application/
├── backend/                # NestJS API
│   ├── prisma/             # Schema, migrations, seed
│   └── src/
│       ├── auth/           # JWT authentication
│       ├── events/         # Events module
│       ├── users/          # Users module
│       └── prisma/         # Prisma service
├── frontend/               # React + Vite SPA
│   └── src/
│       ├── components/     # Shared + calendar components
│       ├── pages/          # Route-level pages
│       └── store/          # Redux slices
├── docker-compose.yml
└── .env.example
```
