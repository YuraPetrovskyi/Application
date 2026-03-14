<div align="right">
  🌐 <a href="README.md">Read in English</a>
</div>

# Система управління подіями

Full-stack застосунок для управління подіями, де користувачі можуть знаходити, створювати та приєднуватись до подій.

🚀 **Live Demo:** [application-indol-ten.vercel.app](https://application-indol-ten.vercel.app)

> Демо акаунти: `alice@example.com` / `password123` або `bob@example.com` / `password123`

---

## Функціонал

- **Автентифікація** — Реєстрація та вхід з JWT-авторизацією
- **Безпека** — HTTP заголовки безпеки (helmet), обмеження запитів на auth та AI endpoints
- **Події** — Створення, редагування, видалення подій із назвою, описом, датою, локацією, місткістю та видимістю
- **Теги** — Додавання кольорових тегів до подій; фільтрація та пошук за тегом
- **Огляд** — Перегляд усіх майбутніх публічних подій (минулі події відфільтровані)
- **Мої події** — Перегляд подій, які ти створив або відвідуєш, у кастомному календарі (вигляди: Місяць / Тиждень / День / Порядок / Рік)
- **Приєднатись / Вийти** — Приєднатись або покинути будь-яку публічну подію
- **Пагінація** — Налаштовувана кількість подій на сторінці (6 / 12 / 24), номер сторінки в URL, налаштування збережені в localStorage
- **AI Асистент** — Чат з AI асистентом (Groq llama-3.3-70b) про твої події та публічні події
- **Seed-дані** — При першому запуску база даних автоматично заповнюється демонстраційними користувачами та подіями

---

## Технологічний стек

| Рівень     | Технологія                                                          |
| ---------- | ------------------------------------------------------------------- |
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS v4, Redux Toolkit, Zustand |
| Backend    | NestJS, TypeScript, Prisma ORM, Passport JWT, Groq SDK              |
| База даних | PostgreSQL 16                                                       |
| DevOps     | Docker, docker-compose                                              |
| Storybook  | Документація компонентів та візуальне тестування                    |

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

> **Які `.env` для чого?**
> - **`.env`** (корінь) — використовується тільки Docker Compose
> - **`backend/.env`** — для локальної розробки (`npm run start:dev`)
> - **`frontend/.env`** — для локальної розробки (`npm run dev`)

```bash
cp .env.example .env
```

Відкрий `.env` і заповни обов'язкові значення:

```env
# Згенеруй: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET="встав-згенероване-значення"

# Безкоштовний ключ: https://console.groq.com
GROQ_API_KEY="gsk_твій-ключ-тут"
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

Відкрий `backend/.env` і встанови пароль PostgreSQL, безпечний `JWT_SECRET` та `GROQ_API_KEY` (необхідний для AI Асистента).

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
| `GROQ_API_KEY`      | Ключ Groq API для AI Асистента                | —                       |

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

### Теги

| Метод | Endpoint | Auth | Опис                                          |
| ----- | -------- | ---- | --------------------------------------------- |
| GET   | `/tags`  | Ні   | Отримати всі доступні теги (заповнені seed'ом) |

> Теги керуються через seed бази даних (`prisma/seed.ts`). Наперед визначений набір: Tech, Art, Business, Music, Science, Sport, Education, Health.

### AI Асистент

| Метод | Endpoint  | Auth | Опис                                        |
| ----- | --------- | ---- | ------------------------------------------- |
| POST  | `/ai/ask` | Так  | Задати питання про події (Groq LLM backend) |

---

## Структура проекту

```
Application/
├── backend/                        # NestJS REST API
│   ├── prisma/
│   │   ├── schema.prisma           ← схема БД: User, Event, EventParticipant
│   │   ├── migrations/             ← SQL міграції
│   │   └── seed.ts                 ← демо-дані (2 користувачі, 50 подій)
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
│       ├── tags/                   ← GET/POST/DELETE /tags
│       │   ├── dto/tag.dto.ts
│       │   ├── tags.service.ts
│       │   └── tags.controller.ts
│       ├── ai/                     ← POST /ai/ask (Groq LLM)
│       │   ├── ai.service.ts       ← buildContext() + Groq chat completion
│       │   └── ai.controller.ts
│       ├── users/                  ← GET /users/me, GET /users/me/events
│       ├── prisma/                 ← PrismaService (глобальний DB клієнт)
│       ├── app.module.ts
│       └── main.ts                 ← Swagger /api/docs, ValidationPipe, CORS
├── frontend/                       # React 18 + Vite SPA
│   ├── .storybook/                 ← конфігурація Storybook
│   └── src/
│       ├── api/axios.ts            ← Axios з JWT interceptor
│       ├── store/
│       │   ├── slices/authSlice.ts     ← login, register, fetchMe (Redux)
│       │   ├── slices/eventsSlice.ts   ← CRUD подій, join/leave (Redux)
│       │   ├── slices/tagsSlice.ts     ← список тегів (Redux)
│       │   └── useUIStore.ts           ← налаштування UI: сторінки, календар, асистент (Zustand + persist)
│       ├── pages/
│       │   ├── LoginPage           ← /login
│       │   ├── RegisterPage        ← /register
│       │   ├── EventsListPage      ← / (публічні події, тільки майбутні)
│       │   ├── EventDetailsPage    ← /events/:id
│       │   ├── CreateEventPage     ← /events/create
│       │   ├── EditEventPage       ← /events/:id/edit
│       │   └── MyEventsPage        ← /my-events (кастомний календар)
│       └── components/
│           ├── ai/                     ← AI дровер + плаваюча кнопка
│           │   ├── AssistantDrawer.tsx   ← AI чат-дровер (стан Zustand)
│           │   └── AIAssistantFAB.tsx    ← плаваюча кнопка (тільки для залогінених)
│           ├── calendar/               ← вигляди: Місяць, Тиждень, День, Порядок, Рік
│           ├── events/                 ← компоненти рівня події
│           │   ├── EventCard.tsx           ← EventCard.stories.tsx
│           │   ├── TagChip.tsx             ← TagChip.stories.tsx
│           │   ├── TagSelector.tsx         ← TagSelector.stories.tsx
│           │   └── ConfirmModal.tsx
│           ├── layout/                 ← оболонка застосунку
│           │   ├── Navbar.tsx
│           │   └── ProtectedRoute.tsx
│           ├── pagination/             ← елементи пагінації
│           │   ├── Pagination.tsx          ← Pagination.stories.tsx
│           │   └── PerPageSelector.tsx     ← PerPageSelector.stories.tsx
│           └── ui/                     ← загальні компоненти
│               ├── Button.tsx              ← Button.stories.tsx
│               ├── Input.tsx               ← Input.stories.tsx
│               ├── BackButton.tsx          ← BackButton.stories.tsx
│               └── LoadingSpinner.tsx      ← LoadingSpinner.stories.tsx
├── docker-compose.yml              ← postgres + backend + frontend
└── .env.example
```
