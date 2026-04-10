# Hair Salon Booking — Technical Specification

## Project Overview

A full-stack web application for booking hair salon appointments. Users can browse services, select staff, pick available time slots, and pay online. An admin panel allows full management of staff, services, and bookings.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| UI | React + Tailwind CSS |
| Auth | NextAuth.js (Credentials + Google OAuth) |
| Database | PostgreSQL |
| ORM | Prisma |
| Payments | Stripe (Card payments + webhooks) |
| Storage | Cloudinary (staff photos, service images) |
| Deployment | Vercel |

---

## Architecture

- **Monorepo** structure under a single Next.js project
- App Router with route groups: `(public)`, `(auth)`, `(dashboard)`, `(admin)`
- Server Components for data fetching; Client Components for interactivity
- API routes under `/app/api/` for all backend logic
- Strict separation: `services/`, `repositories/`, `types/`, `utils/`, `components/`
- OOP-style service classes (e.g. `BookingService`, `StaffService`, `PaymentService`)
- DRY principles enforced — shared logic lives in service/utility layers, never duplicated in components
- All sensitive operations run server-side only; no secrets exposed to the client

---

## Authentication

### Methods
- **Email + Password** — hashed with bcrypt, stored in DB
- **Google OAuth** — via NextAuth.js Google Provider

### Behaviour
- Unauthenticated users can browse services and staff freely
- Booking requires an authenticated account
- On booking attempt without an account → redirect to sign-up/sign-in with return URL preserved
- JWT sessions via NextAuth; refresh handled automatically
- Role field on User model: `USER` | `ADMIN`

---

## Database Schema (Prisma)

```prisma
model User {
  id            String        @id @default(cuid())
  email         String        @unique
  passwordHash  String?
  name          String
  role          Role          @default(USER)
  provider      AuthProvider  @default(CREDENTIALS)
  bookings      Booking[]
  createdAt     DateTime      @default(now())
}

model Category {
  id       String    @id @default(cuid())
  name     String
  slug     String    @unique
  services Service[]
}

model Service {
  id          String    @id @default(cuid())
  name        String
  description String
  price       Decimal
  duration    Int
  imageUrl    String?
  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id])
  staffLinks  StaffService[]
  bookings    Booking[]
}

model Staff {
  id          String         @id @default(cuid())
  name        String
  bio         String?
  photoUrl    String?
  services    StaffService[]
  slots       TimeSlot[]
  bookings    Booking[]
}

model StaffService {
  staffId   String
  serviceId String
  staff     Staff   @relation(fields: [staffId], references: [id])
  service   Service @relation(fields: [serviceId], references: [id])
  @@id([staffId, serviceId])
}

model TimeSlot {
  id        String   @id @default(cuid())
  staffId   String
  staff     Staff    @relation(fields: [staffId], references: [id])
  startTime DateTime
  endTime   DateTime
  isBooked  Boolean  @default(false)
  booking   Booking?
}

model Booking {
  id              String        @id @default(cuid())
  userId          String
  user            User          @relation(fields: [userId], references: [id])
  serviceId       String
  service         Service       @relation(fields: [serviceId], references: [id])
  staffId         String
  staff           Staff         @relation(fields: [staffId], references: [id])
  slotId          String        @unique
  slot            TimeSlot      @relation(fields: [slotId], references: [id])
  status          BookingStatus @default(PENDING)
  stripePaymentId String?
  totalPrice      Decimal
  createdAt       DateTime      @default(now())
}

enum Role          { USER ADMIN }
enum AuthProvider  { CREDENTIALS GOOGLE }
enum BookingStatus { PENDING CONFIRMED CANCELLED COMPLETED }
```

---

## Pages & Routes

### Public (no auth required)

| Route | Description |
|---|---|
| `/` | Landing page — hero, featured services, CTA |
| `/services` | All services grouped by category |
| `/services/[categorySlug]` | Services filtered by category |
| `/services/[categorySlug]/[serviceId]` | Service detail + available staff |
| `/staff` | All staff members |
| `/staff/[staffId]` | Staff profile + their offered services |
| `/book` | Booking wizard (redirects to sign-in if unauthenticated) |

### Auth

| Route | Description |
|---|---|
| `/sign-in` | Sign in (email or Google) |
| `/sign-up` | Register (email or Google) |

### User Dashboard (auth required)

| Route | Description |
|---|---|
| `/dashboard` | Upcoming & past bookings |
| `/dashboard/bookings/[id]` | Booking detail + cancel option |
| `/dashboard/profile` | Edit profile |

### Admin Panel (`/admin`, role: ADMIN)

| Route | Description |
|---|---|
| `/admin` | Overview stats |
| `/admin/staff` | List + create/edit/delete staff |
| `/admin/staff/[id]` | Edit staff details, assign services |
| `/admin/services` | List + create/edit/delete services |
| `/admin/services/[id]` | Edit service — name, description, price, duration, category, image |
| `/admin/categories` | Manage categories |
| `/admin/bookings` | All bookings with filters (date, staff, status) |
| `/admin/schedule` | Manage staff time slots / availability |

---

## Booking Flow

### Entry Points
1. **Service first** → choose service → choose staff who offers it → pick slot → pay
2. **Staff first** → choose staff member → choose service they offer → pick slot → pay

### Step-by-step Wizard

```
Step 1: Select Service (or skip if coming from staff profile)
Step 2: Select Staff
  → If chosen staff has no availability for that service:
      show alert + suggest other staff members who offer the same service with available slots
Step 3: Select Date & Time
  → Calendar showing only dates that have at least one free slot
  → Time grid showing available slots only (booked slots are hidden, not greyed)
Step 4: Review Summary (service, staff, date/time, price)
Step 5: Payment (Stripe)
Step 6: Confirmation page + email notification
```

### Alternative Staff Suggestion Logic
- When a slot is selected and `TimeSlot.isBooked === true` (race condition) or staff has no free slots on chosen date:
  - Query all staff linked to the same service with available slots
  - Display suggestion card: "This time is unavailable. Other stylists offer this service:" + list with available times

---

## Availability Logic

- `TimeSlot` records are pre-generated by admin per staff member
- `isBooked` is set to `true` only after Stripe payment is confirmed (webhook)
- Fetching available slots: `WHERE staffId = ? AND serviceId overlaps AND isBooked = false AND startTime > now()`
- Slot duration matches `Service.duration` (e.g. 60 min slots for 60 min service)
- Optimistic locking: slot is reserved for 10 minutes during checkout; released if payment not completed

---

## Payments (Stripe)

- **Stripe Checkout** or **Stripe Payment Element** embedded in booking wizard Step 5
- Flow:
  1. Create `PaymentIntent` server-side via `/api/payments/create-intent`
  2. Client confirms payment using Stripe.js
  3. On success → Stripe webhook hits `/api/webhooks/stripe`
  4. Webhook verifies signature, sets `Booking.status = CONFIRMED`, `TimeSlot.isBooked = true`
- All amounts in cents internally; displayed in user's currency
- Refunds handled via Stripe Dashboard or admin panel cancel action
- No card data ever touches the application server (PCI compliance via Stripe)

---

## Admin Panel Capabilities

- **Staff management**: add/edit/delete staff, upload photo, assign/unassign services, manage weekly schedule & time slots
- **Service management**: add/edit/delete services, set name, description, price, duration, category, image
- **Category management**: add/edit/delete categories, set display order
- **Booking management**: view all bookings, filter by date/staff/status, manually cancel bookings (triggers Stripe refund)
- **Schedule management**: generate recurring time slots for staff, block out dates/times
- Protected by middleware: only users with `role === ADMIN` can access `/admin/**`

---

## Security Requirements

- All API routes validate session server-side before any DB operation
- Admin routes protected by both session check and role check (`ADMIN`)
- Input validation with **Zod** on all API route handlers
- CSRF protection via NextAuth built-in tokens
- Stripe webhook signature verification with `stripe.webhooks.constructEvent`
- Passwords hashed with **bcrypt** (salt rounds ≥ 12)
- No sensitive data (passwords, Stripe keys) logged or exposed to client
- Environment variables: all secrets in `.env.local`, never committed
- Rate limiting on auth endpoints (e.g. via `upstash/ratelimit`)
- SQL injection prevention via Prisma parameterised queries

---

## Code Standards

- **TypeScript strict mode** enabled
- **OOP** — business logic encapsulated in service classes; repositories handle DB access
- **DRY** — shared types in `types/`, shared UI in `components/ui/`, shared logic in `lib/`
- **Mapping** — API responses mapped to typed DTOs before reaching UI layer
- No comments in code — self-documenting naming required
- ESLint + Prettier enforced
- Path aliases: `@/components`, `@/lib`, `@/types`, `@/services`, etc.

---

## Folder Structure

```
/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── (admin)/
│   └── api/
├── components/
│   ├── ui/
│   ├── booking/
│   ├── admin/
│   └── layout/
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── stripe.ts
│   └── validators/
├── services/
│   ├── BookingService.ts
│   ├── StaffService.ts
│   ├── ServiceService.ts
│   └── PaymentService.ts
├── repositories/
│   ├── BookingRepository.ts
│   ├── StaffRepository.ts
│   └── ServiceRepository.ts
├── types/
│   └── index.ts
├── prisma/
│   └── schema.prisma
└── public/
```

---

## Environment Variables

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## UI / UX Notes

- Interface language: **English**
- Fully responsive (mobile-first with Tailwind)
- Booking wizard uses a persistent stepper component showing current step
- Date picker shows a monthly calendar; days with zero available slots are disabled
- Time slots rendered as a grid of buttons; no hidden/greyed occupied slots
- Loading skeletons on all async data fetches
- Toast notifications for success/error states
- Accessible: keyboard navigable, ARIA labels on interactive elements