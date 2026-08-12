# Mentor Live

Mentor Live is a full-stack faculty booking platform that connects students with tutors ("faculty"). Students can browse subjects and faculty, then book either a **one-to-one session** or join a **group (pooling) session**, straight from the browser. Admins and sales staff get a dashboard to manage faculty, bookings, leads, content, and view business analytics.

**Live site:** [mentorlive.in](https://mentorlive.in)

Built by a small team as a real-world, production-style project. I worked mainly on the **backend** (API, database design, business logic, architecture), and also contributed to the frontend.

---

## What it does

**For students**
- Browse subjects, chapters, and faculty profiles
- Check faculty availability and book a one-to-one or group session
- Read blogs and testimonials, and submit interest as a lead
- Secure login with JWT-based sessions (httpOnly cookies)

**For admins & sales team**
- Dashboard with KPIs, booking trends, and performance charts
- Manage faculty (profiles, time slots, subjects, availability)
- Manage classes, subjects, syllabus, and chapters (the academic structure)
- Confirm, cancel, or track bookings (one-to-one and group)
- Manage leads (CRM-style: capture, follow up, update status)
- Manage students/users (block/unblock)
- Manage homepage banners, blogs, and testimonials
- Export data (e.g. bookings) for reporting
- WhatsApp notification sent automatically on booking confirmation

Access is role-based: **student**, **sales**, and **admin** each see different parts of the app.

---

## Tech Stack

**Frontend**
- React 19 + TypeScript, built with Vite
- Tailwind CSS 4
- TanStack Query (server state/caching)
- React Router 7
- Axios (with automatic access-token refresh on 401)
- Cloudinary (image upload & cropping)

**Backend**
- Node.js + Express 5, TypeScript
- MongoDB with Mongoose
- Layered / clean architecture: controllers → use-cases → repositories, with DTOs, mappers, and entities kept separate
- Dependency injection with `tsyringe`
- JWT authentication (short-lived access token + refresh token, stored in httpOnly cookies)
- Zod for request validation
- Cloudinary for media storage, Twilio for WhatsApp notifications
- Rate limiting on sensitive routes

The backend is organized as independent feature modules (faculty, booking, subject, chapter, lead, blog, testimonial, banner, analytics, etc.), each with its own routes, controller, use-cases, repository, and database schema — making the codebase easy to extend and test.

---

## Project Structure

```
mentor-live/
├── backend/     # Express + TypeScript API (MongoDB, clean architecture)
│   └── src/
│       ├── modules/     # Feature modules (faculty, booking, subject, lead, ...)
│       ├── core/        # Shared utils, constants, error handling
│       ├── infrastructure/  # Auth middleware, external services
│       └── di/           # Dependency injection containers
└── frontend/    # React + TypeScript client (Vite, Tailwind)
    └── src/
        ├── features/    # admin, auth, user areas
        ├── api/         # API request layer
        └── shared/      # Shared components, types, utils
```

---

## Running it locally

**Requirements:** Node.js 18+, a MongoDB database (local or Atlas), a Cloudinary account, and a Twilio account (for WhatsApp notifications).

**1. Backend**
```bash
cd backend
npm install
```
Copy `backend/.env.example` to `backend/.env` and fill in your own values (MongoDB URI, JWT secrets, Cloudinary, Twilio).
```bash
npm run dev
```

**2. Frontend**
```bash
cd frontend
npm install
```
Copy `frontend/.env.example` to `frontend/.env` and fill in your own values.
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Author

**Muhammed Hakeem** — Backend development, API design & architecture
[GitHub](https://github.com/Hakeemnk18)
