<div align="right">
  🌐 <a href="README.md">Read in English</a>
</div>

# Система управління подіями

Full-stack застосунок для управління подіями, де користувачі можуть знаходити, створювати та приєднуватись до подій.

---

## Функціонал

- **Автентифікація** — Реєстрація та вхід з JWT-авторизацією
- **Події** — Створення, редагування, видалення подій із назвою, описом, датою, локацією, місткістю та видимістю
- **Огляд** — Перегляд усіх майбутніх публічних подій (минулі події відфільтровані)
- **Мої події** — Перегляд подій, які ти створив або відвідуєш, у кастомному календарі (вигляди: Місяць / Тиждень / День / Порядок / Рік)
- **Приєднатись / Вийти** — Приєднатись або покинути будь-яку публічну подію
- **Seed-дані** — При першому запуску база даних автоматично заповнюється демонстраційними користувачами та подіями

---

## Технологічний стек

| Рівень     | Технологія                                                 |
| ---------- | ---------------------------------------------------------- |
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS v4, Redux Toolkit |
| Backend    | NestJS, TypeScript, Prisma ORM, Passport JWT               |
| База даних | PostgreSQL 16                                              |
| DevOps     | Docker, docker-compose                                     |

---

## Запуск

### Варіант 1: Docker (рекомендовано)

**Необхідно:** Встановлений та запущений [Docker Desktop](https://www.docker.com/products/docker-desktop).

**1. Клонуй репозиторій**

```bash
git clone <repository-url>
cd Application
```

**2. Створи файл змінних середовища**

```bash
cp .env.example .env
```

Відкрий `.env` і встанови безпечне значення для `JWT_SECRET`. Згенеруй його командою або іншим методом:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Встав результат у `.env`:

```env
JWT_SECRET="встав-згенероване-значення"
```

**3. Запусти застосунок**

```bash
docker compose up --build
```

При першому запуску буде:

- Завантажено та запущено контейнер PostgreSQL
- Зібрано та запущено backend (міграції + seed-дані)
- Зібрано та запущено frontend

| Сервіс       | URL                            |
| ------------ | ------------------------------ |
| Frontend     | http://localhost:5173          |
| Backend API  | http://localhost:3000          |
| Swagger Docs | http://localhost:3000/api/docs |

**Демо-акаунти (автоматично створюються):**
| Email | Пароль |
|-------------------|-------------|
| alice@example.com | password123 |
| bob@example.com | password123 |

**Зупинити контейнери:**

```bash
# Зупинити та зберегти дані
docker compose down

# Зупинити та видалити всі дані
docker compose down -v
```

---

### Варіант 2: Локальна розробка

**Необхідно:** Node.js 20+, локально запущений PostgreSQL.

**1. Встанови залежності**

```bash
cd backend && npm install
cd ../frontend && npm install
```

**2. Налаштуй змінні середовища**

Скопіюй вручну або використай команду (macOS/Linux/Git Bash):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Відкрий `backend/.env` і встанови пароль PostgreSQL та безпечний `JWT_SECRET`.

**3. Налаштуй базу даних**

```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

**4. Запусти обидва сервери**

```bash
# Термінал 1 — backend
cd backend && npm run start:dev

# Термінал 2 — frontend
cd frontend && npm run dev
```

---

## Змінні середовища

| Змінна              | Опис                                          | За замовчуванням        |
| ------------------- | --------------------------------------------- | ----------------------- |
| `POSTGRES_USER`     | Ім'я користувача PostgreSQL                   | `postgres`              |
| `POSTGRES_PASSWORD` | Пароль PostgreSQL                             | `postgres`              |
| `POSTGRES_DB`       | Назва бази даних                              | `event_management`      |
| `DATABASE_URL`      | Повний рядок підключення до PostgreSQL        | —                       |
| `JWT_SECRET`        | Секретний ключ для підпису JWT токенів        | —                       |
| `JWT_EXPIRES_IN`    | Час дії JWT токена                            | `7d`                    |
| `PORT`              | Порт backend-сервера                          | `3000`                  |
| `FRONTEND_URL`      | URL фронтенду — backend використовує для CORS | `http://localhost:5173` |
| `VITE_API_URL`      | URL backend для frontend                      | `http://localhost:3000` |

---

## API Endpoints

### Автентифікація

| Метод | Endpoint         | Опис                          |
| ----- | ---------------- | ----------------------------- |
| POST  | `/auth/register` | Реєстрація нового користувача |
| POST  | `/auth/login`    | Вхід та отримання JWT токена  |

### Події

| Метод  | Endpoint            | Auth | Опис                            |
| ------ | ------------------- | ---- | ------------------------------- |
| GET    | `/events`           | Ні   | Отримати всі публічні події     |
| GET    | `/events/:id`       | Ні   | Отримати подію за ID            |
| POST   | `/events`           | Так  | Створити нову подію             |
| PATCH  | `/events/:id`       | Так  | Оновити подію (тільки власник)  |
| DELETE | `/events/:id`       | Так  | Видалити подію (тільки власник) |
| POST   | `/events/:id/join`  | Так  | Приєднатись до події            |
| POST   | `/events/:id/leave` | Так  | Покинути подію                  |

### Користувачі

| Метод | Endpoint           | Auth | Опис                                                           |
| ----- | ------------------ | ---- | -------------------------------------------------------------- |
| GET   | `/users/me`        | Так  | Отримати профіль поточного користувача                         |
| GET   | `/users/me/events` | Так  | Отримати події, створені або відвідувані поточним користувачем |

---

## Структура проекту

```
Application/
├── backend/                        # NestJS REST API
│   ├── prisma/
│   │   ├── schema.prisma           ← схема БД: User, Event, EventParticipant
│   │   ├── migrations/             ← SQL міграції
│   │   └── seed.ts                 ← демо-дані (2 користувачі, 3 події)
│   └── src/
│       ├── auth/                   ← POST /auth/register, POST /auth/login
│       │   ├── dto/auth.dto.ts     ← RegisterDto, LoginDto (class-validator)
│       │   ├── auth.service.ts     ← bcrypt хешування, підпис JWT
│       │   ├── auth.controller.ts
│       │   ├── jwt.strategy.ts     ← перевірка Bearer токена на кожен запит
│       │   ├── jwt-auth.guard.ts   ← захист приватних endpoints
│       │   └── optional-jwt-auth.guard.ts  ← передає user якщо токен є
│       ├── events/                 ← CRUD + join/leave
│       │   ├── dto/event.dto.ts    ← CreateEventDto, UpdateEventDto
│       │   ├── events.service.ts   ← бізнес-логіка, Prisma запити
│       │   └── events.controller.ts
│       ├── users/                  ← GET /users/me, GET /users/me/events
│       ├── prisma/                 ← PrismaService (глобальний DB клієнт)
│       ├── app.module.ts
│       └── main.ts                 ← Swagger /api/docs, ValidationPipe, CORS
├── frontend/                       # React 18 + Vite SPA
│   └── src/
│       ├── api/axios.ts            ← Axios з JWT interceptor
│       ├── store/
│       │   ├── slices/authSlice.ts     ← login, register, fetchMe
│       │   └── slices/eventsSlice.ts   ← CRUD подій, join/leave
│       ├── pages/
│       │   ├── LoginPage           ← /login
│       │   ├── RegisterPage        ← /register
│       │   ├── EventsListPage      ← / (публічні події, тільки майбутні)
│       │   ├── EventDetailsPage    ← /events/:id
│       │   ├── CreateEventPage     ← /events/create
│       │   ├── EditEventPage       ← /events/:id/edit
│       │   └── MyEventsPage        ← /my-events (кастомний календар)
│       └── components/
│           ├── calendar/           ← вигляди: Місяць, Тиждень, День, Порядок, Рік
│           ├── Navbar.tsx
│           ├── EventCard.tsx
│           ├── ProtectedRoute.tsx
│           └── ConfirmModal.tsx
├── docker-compose.yml              ← postgres + backend + frontend
└── .env.example
```
