# service_booking_system
Added some text in branch menu
#  Hair Salon Booking App

A full-stack web application for booking hair salon appointments — built with modern technologies and real-world architecture.

Users can browse services, choose a stylist, pick available time slots and pay online. Admins get a powerful dashboard to manage everything.

---

##  Features

###  For Users

* Browse services by category
* View staff profiles and availability
* Book appointments with a step-by-step wizard
* Secure online payments (Stripe)
* Personal dashboard with bookings history
* Email confirmations after booking

###  For Admins

* Manage staff (create/edit/delete)
* Assign services to staff
* Manage services & categories
* Generate and control time slots
* View and filter all bookings
* Cancel bookings with refund support

---

## Tech Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS
* **Backend:** Next.js API routes
* **Language:** TypeScript
* **Auth:** NextAuth.js (Credentials + Google OAuth)
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Payments:** Stripe (PaymentIntent + Webhooks)
* **Storage:** Cloudinary
* **Deployment:** Vercel

---

## Architecture

This project follows a clean and scalable structure:

* Monorepo inside a single Next.js app
* Server Components for data fetching
* Client Components for interactivity
* OOP-style services (`BookingService`, `StaffService`, etc.)
* Repository layer for database access
* Strict separation of concerns (no business logic in UI)

```
components → UI
services   → business logic
repositories → database
lib        → configs/utilities
```

Everything sensitive runs server-side only.

---

## Authentication

* Email & password (bcrypt hashed)
* Google OAuth login
* JWT sessions via NextAuth
* Role-based access (`USER`, `ADMIN`)

---

## Booking Flow

1. Choose **service** or **staff**
2. Select stylist
3. Pick available date & time
4. Review booking
5. Pay with Stripe
6. Get confirmation 

If a slot becomes unavailable → user gets **alternative staff suggestions**

---

## Payments

* Stripe PaymentIntent
* Secure checkout (no card data stored)
* Webhooks confirm booking
* Slot is marked as booked only after successful payment

---

## Database

Built with Prisma + PostgreSQL.

Main entities:

* `User`
* `Service`
* `Staff`
* `TimeSlot`
* `Booking`
* `Category`

Relations ensure:

* No double booking
* Staff ↔ Services mapping
* Slot-level control

---

## Security

* Server-side session validation
* Admin route protection
* Zod validation on all APIs
* Stripe webhook verification
* Password hashing (bcrypt)
* Rate limiting (Upstash)
* No secrets exposed to client

---

## Project Structure

```
app/
  (public)/
  (auth)/
  (dashboard)/
  (admin)/
  api/

components/
services/
repositories/
lib/
types/
prisma/
public/
```

---

## Environment Variables

Create `.env.local`:

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

## UX Principles

This app follows key UX rules:

* Simple and clear booking flow
* Only available slots shown (no confusion)
* Fast navigation and minimal clicks
* Mobile-first responsive design
* Accessibility support

---

## Development Philosophy

* TypeScript strict mode
* Clean architecture
* DRY (no duplicated logic)
* Self-documenting code (no unnecessary comments)
* Reusable components
* Scalable structure

---

## Future Improvements

* Notifications (SMS / push)
* Loyalty system
* Reviews & ratings
* Multi-location salons
* Calendar sync (Google Calendar)

---

## Getting Started

```bash
git clone https://github.com/your-username/hair-salon-booking.git

cd hair-salon-booking

npm install

npm run dev
```

---

## Author

Built as a full-stack project to practice real-world architecture, payments, and booking systems.
