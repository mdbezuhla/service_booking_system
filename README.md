# Hair Salon Booking System

Повноцінний веб-додаток для бронювання записів у перукарський салон, побудований на Next.js, TypeScript та PostgreSQL.

## Технології

- **Фреймворк:** Next.js 15 (App Router)
- **Мова:** TypeScript (strict mode)
- **UI:** React + Tailwind CSS
- **Автентифікація:** NextAuth.js v5 (логін/пароль + Google OAuth)
- **База даних:** PostgreSQL з Prisma ORM
- **Платежі:** Stripe (Payment Intents + Webhooks)
- **Зберігання файлів:** Cloudinary (фото майстрів, зображення послуг)
- **Деплой:** Vercel

## Можливості

- Перегляд послуг, згрупованих за категоріями
- Профілі майстрів з переліком послуг, які вони надають
- Покроковий візард бронювання (послуга → майстер → дата/час → перевірка → оплата)
- Безпечна онлайн-оплата через Stripe
- Особистий кабінет користувача для керування записами
- Адмін-панель для керування майстрами, послугами, категоріями, бронюваннями та розкладом
- Автентифікація через Google OAuth та електронну пошту/пароль
- Адаптивний темний інтерфейс (mobile-first)

## Початок роботи

### Вимоги

- Node.js 18+
- База даних PostgreSQL
- Акаунт Stripe (для оплати)
- Облікові дані Google OAuth (для соціального входу)
- Акаунт Cloudinary (для завантаження зображень)

### Встановлення

```bash
git clone https://github.com/your-username/service_booking_system.git
cd service_booking_system
npm install
```

### Налаштування середовища

Скопіюйте файл прикладу змінних середовища та заповніть значення:

```bash
cp .env.example .env.local
```

Необхідні змінні середовища:

| Змінна | Опис |
|---|---|
| `DATABASE_URL` | Рядок підключення до PostgreSQL |
| `NEXTAUTH_SECRET` | Випадковий секретний ключ для NextAuth.js |
| `NEXTAUTH_URL` | URL додатку (http://localhost:3000 для розробки) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `STRIPE_SECRET_KEY` | Секретний ключ Stripe |
| `STRIPE_PUBLISHABLE_KEY` | Публічний ключ Stripe |
| `STRIPE_WEBHOOK_SECRET` | Ключ підпису вебхуків Stripe |
| `CLOUDINARY_CLOUD_NAME` | Назва хмари Cloudinary |
| `CLOUDINARY_API_KEY` | API ключ Cloudinary |
| `CLOUDINARY_API_SECRET` | API секрет Cloudinary |

### Налаштування бази даних

```bash
npx prisma generate
npx prisma db push
```

### Розробка

```bash
npm run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000).

### Stripe Webhooks (локальна розробка)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Структура проєкту

```
├── app/                  # Сторінки Next.js App Router
│   ├── (public)/         # Публічні сторінки (послуги, майстри, бронювання)
│   ├── (auth)/           # Сторінки автентифікації (вхід, реєстрація)
│   ├── (dashboard)/      # Особистий кабінет
│   ├── (admin)/          # Адмін-панель
│   └── api/              # API маршрути
├── components/           # React компоненти
│   ├── ui/               # Багаторазові UI компоненти
│   ├── booking/          # Компоненти бронювання
│   └── layout/           # Компоненти макету
├── lib/                  # Основні бібліотеки
│   ├── auth.ts           # Конфігурація NextAuth.js
│   ├── prisma.ts         # Prisma клієнт (singleton)
│   ├── stripe.ts         # Stripe клієнт
│   └── validators/       # Схеми валідації Zod
├── services/             # Шар бізнес-логіки (ООП)
├── repositories/         # Шар доступу до даних
├── types/                # Спільні TypeScript типи/DTO
├── prisma/               # Prisma схема
└── middleware.ts         # Middleware автентифікації
```

## Архітектура

- **ООП Сервіси:** Бізнес-логіка інкапсульована у сервісних класах (`BookingService`, `StaffService` тощо)
- **Патерн Repository:** Доступ до бази даних абстрагований через класи репозиторіїв
- **DTO Маппінг:** Відповіді API маппляться на типізовані DTO перед передачею в UI
- **Розділення Server/Client:** Server Components для отримання даних; Client Components для інтерактивності
- **Zod Валідація:** Всі вхідні дані API валідуються на стороні сервера

## Ліцензія

MIT

---

## 🇬🇧 English

A full-stack web application for booking hair salon appointments built with Next.js, TypeScript, and PostgreSQL.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **UI:** React + Tailwind CSS
- **Auth:** NextAuth.js v5 (Credentials + Google OAuth)
- **Database:** PostgreSQL with Prisma ORM
- **Payments:** Stripe (Payment Intents + Webhooks)
- **Storage:** Cloudinary (staff photos, service images)
- **Deployment:** Vercel

## Features

- Browse services grouped by category
- View staff profiles and their offered services
- Multi-step booking wizard (service → stylist → date/time → review → payment)
- Secure online payments via Stripe
- User dashboard for managing bookings
- Admin panel for managing staff, services, categories, bookings, and schedules
- Google OAuth and email/password authentication
- Responsive, mobile-first dark theme UI

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (for payments)
- Google OAuth credentials (for social login)
- Cloudinary account (for image uploads)

### Installation

```bash
git clone https://github.com/your-username/service_booking_system.git
cd service_booking_system
npm install
```

### Environment Setup

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for NextAuth.js |
| `NEXTAUTH_URL` | App URL (http://localhost:3000 for dev) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Database Setup

```bash
npx prisma generate
npx prisma db push
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Stripe Webhooks (Local Development)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── (public)/         # Public pages (services, staff, booking)
│   ├── (auth)/           # Auth pages (sign-in, sign-up)
│   ├── (dashboard)/      # User dashboard
│   ├── (admin)/          # Admin panel
│   └── api/              # API routes
├── components/           # React components
│   ├── ui/               # Reusable UI components
│   ├── booking/          # Booking-specific components
│   └── layout/           # Layout components
├── lib/                  # Core libraries
│   ├── auth.ts           # NextAuth.js configuration
│   ├── prisma.ts         # Prisma client singleton
│   ├── stripe.ts         # Stripe client
│   └── validators/       # Zod validation schemas
├── services/             # Business logic layer (OOP)
├── repositories/         # Data access layer
├── types/                # Shared TypeScript types/DTOs
├── prisma/               # Prisma schema
└── middleware.ts         # Auth middleware
```

## Architecture

- **OOP Services:** Business logic encapsulated in service classes (`BookingService`, `StaffService`, etc.)
- **Repository Pattern:** Database access abstracted through repository classes
- **DTO Mapping:** API responses mapped to typed DTOs before reaching UI
- **Server/Client Split:** Server Components for data fetching; Client Components for interactivity
- **Zod Validation:** All API inputs validated server-side

## License

MIT
