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

Створи `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/event_management"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3000
```

Створи `frontend/.env`:

```env
VITE_API_URL="http://localhost:3000"
```

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
├── backend/                # NestJS API
│   ├── prisma/             # Схема, міграції, seed
│   └── src/
│       ├── auth/           # JWT автентифікація
│       ├── events/         # Модуль подій
│       ├── prisma/         # Prisma сервіс
│       └── users/          # Модуль користувачів
├── frontend/               # React + Vite SPA
│   └── src/
│       ├── components/     # Спільні компоненти + календар
│       ├── pages/          # Сторінки (роути)
│       └── store/          # Redux слайси
├── docker-compose.yml
└── .env.example
```
