# Roster

Multi-tenant staff scheduling for service businesses — salons, clinics, studios, anything booked by the seat or the chair. Every business gets its own isolated workspace; every booking is checked against that staff member's existing schedule before it's allowed to save.

[Leia em português](./README.pt-BR.md)

## Why this exists

The interesting part of a booking system isn't the calendar UI — it's making sure two clients can never end up assigned to the same stylist at the same time, and making sure that guarantee holds even when two requests race each other. This project is built around that guarantee, plus the second problem every scheduling SaaS has to solve on day one: **tenant isolation**. Every table, every query and every real-time event is scoped to a `tenantId`, and that scoping is enforced in the service layer — never left to the client to get right.

## Architecture

```
apps/
  web/   Next.js 16 (App Router, TypeScript, Tailwind) — schedule board, team, services, dashboard
  api/   Node/Express (TypeScript) — REST API + Socket.IO, Prisma ORM, PostgreSQL
```

```
src/
  domain/              appointmentConflict.ts — pure interval-overlap logic, framework-free, unit tested
                        errors.ts — typed domain errors mapped to HTTP status codes
  modules/<name>/      <name>.schema.ts    Zod input validation
                        <name>.service.ts   business logic, tenant-scoped Prisma queries
                        <name>.repository.ts (appointments — the query layer is worth reading)
                        <name>.routes.ts    Express router, thin controllers
  middlewares/         auth, role guards, rate limiting, centralized error handling
  realtime/            Socket.IO rooms — one room per tenant, joined only after verifying the session token
```

## The conflict check

Booking an appointment computes `endTime` from the service's duration, pulls every non-cancelled appointment that staff member has on that day, and runs each one through `rangesOverlap` (`src/domain/appointmentConflict.ts`). Any overlap — full or partial — rejects the booking with a `409` naming the exact conflicting slot, before anything touches the database. The same pure function is exercised directly in `tests/appointmentConflict.test.ts`, so the rule is verified independently of Express, Prisma or HTTP.

## Multi-tenancy & security

- Every table that isn't the tenant itself carries a `tenantId` column, and every query filters by it — a request from tenant A can never read or write tenant B's staff, services or appointments, even if it guesses a valid-looking ID.
- Passwords hashed with bcrypt (cost factor 12); sessions are JWTs (carrying `userId`, `tenantId`, `role`) in `httpOnly`, `sameSite=lax` cookies.
- Role checks (`OWNER` / `ADMIN` / `STAFF`) are enforced in the service layer, not just hidden in the UI — an admin trying to promote someone to admin, or a staff member trying to cancel a colleague's appointment, is rejected with a `403` from the API itself (see `staff.service.ts` and `appointments.service.ts`).
- Realtime events are scoped the same way: Socket.IO connections join a room named after their tenant only after their session cookie is verified, so one business never sees another's live updates.
- All input validated with Zod at the boundary; Prisma parameterizes every query.
- Rate limiting on auth endpoints, `helmet` security headers, CORS locked to the configured web origin.
- No secret ever lives in source control — see [Configuration](#getting-started).

## Getting started

### Prerequisites

- Node.js 20+
- A PostgreSQL 14+ instance (local or hosted)

### 1. Configure the API

```bash
cd apps/api
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Random string, 32+ characters (`openssl rand -hex 32`) |
| `WEB_ORIGIN` | URL of the frontend, for CORS (`http://localhost:3001` in dev) |

```bash
npm install
npm run prisma:migrate   # creates the schema
npm run prisma:seed      # demo tenant, team and services
npm run dev              # http://localhost:4001
```

Demo accounts created by the seed, all in the same tenant (password `Passw0rd!123`):

| Role | Email |
| --- | --- |
| Owner | `owner@shiftboard.dev` |
| Admin | `admin@shiftboard.dev` |
| Staff | `stylist1@shiftboard.dev` |

### 2. Configure the web app

```bash
cd apps/web
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL
npm install
npm run dev -- -p 3001             # http://localhost:3001
```

## Testing

```bash
cd apps/api
npm test        # scheduling-conflict unit tests (Vitest)
```

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS · TanStack Query · Node.js · Express · Socket.IO · Prisma · PostgreSQL · Zod · Vitest
