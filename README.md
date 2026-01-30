# Notes App (Next.js + Auth + Prisma)

Snappy: A tiny notes app where you can sign up, sign in, and manage your own notes. Built to learn how modern Next.js apps are wired end‑to‑end.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What It Does (Short)

- Sign up with email/password
- Sign in with credentials
- Create and delete notes
- Each user sees only their own notes

## What We Learned (Detailed)

### 1) Next.js App Router mental model
- **Folder‑based routing**: each folder under `src/app` becomes a route segment (e.g., `src/app/notes/page.tsx` → `/notes`).
- **Server vs client components**: server components fetch DB data directly; client components handle UI state and browser events.
- **Route handlers**: `src/app/api/.../route.ts` is an API endpoint inside the same app.

### 2) Prisma + SQLite basics
- **Schema first**: data models live in `prisma/schema.prisma`.
- **Migrations**: `npx prisma migrate dev --name init` creates `dev.db` and syncs schema.
- **Client generation**: `npx prisma generate` generates the Prisma client.

### 3) Auth.js (NextAuth) with Credentials
- **Providers** define how users sign in (we used Credentials).
- **JWT strategy** is required for Credentials in this setup.
- **Adapter** lets Auth.js store users in the DB.

### 4) Real‑world integration gotchas
- Prisma v7 requires:
  - **No `datasource.url` in schema** (it lives in `prisma.config.ts`).
  - **Explicit client output** (we generate to `src/generated/prisma`).
  - **SQLite adapter** when using the `client` engine.
- Signup moved to an **API route** (Turbopack + server action glitches), so the form posts to `/api/signup`.

## How We Built It (Detailed)

### Core files
- `prisma/schema.prisma` — DB models: `User`, `Note`, and Auth tables.
- `src/lib/prisma.ts` — shared Prisma client using SQLite adapter.
- `src/lib/auth.ts` — NextAuth config (Credentials provider).
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth API route.
- `src/app/api/signup/route.ts` — signup endpoint (hashes password, creates user).
- `src/app/signin/page.tsx` — login form (calls `signIn`).
- `src/app/signup/page.tsx` — signup form (POSTs to `/api/signup`).
- `src/app/notes/page.tsx` — protected notes UI.
- `src/app/notes/actions.ts` — server actions (create/delete notes).

### Auth flow (high‑level)
1. User signs up → `/api/signup` hashes password and creates user.
2. User signs in → NextAuth Credentials provider verifies password.
3. Session stored as **JWT** cookie.
4. `/notes` checks session with `getServerSession`.

### Notes flow
1. `/notes` fetches notes for the logged‑in user.
2. `createNote` / `deleteNote` server actions mutate DB.
3. `revalidatePath("/notes")` refreshes the page list.

## Environment

`.env` must include:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Optional Extensions

- Edit notes
- Tag/search notes
- Switch SQLite → Postgres
- Move styles to a component library (shadcn/ui)

## [FB Notes]_ai

We needed to build a tiny notes app with real logins, which required **A) a web framework**, **B) a database**, and **C) authentication**.  
**A = Next.js (App Router)** so we could ship pages, API routes, and server logic in one place.  
**B = Prisma + SQLite** so we could model data, run migrations, and query notes without wiring a DB by hand.  
**C = Auth.js (NextAuth) Credentials** so users could create accounts, sign in, and have sessions.

Once those pillars were clear, everything followed from them:
1) **Define the data model** → we wrote `prisma/schema.prisma` with `User`, `Note`, and Auth tables, because Auth.js needs those tables and our app needs `Note`.  
2) **Generate the client + DB** → we ran migrations and `prisma generate` so the app can talk to SQLite safely and with types.  
3) **Set up auth** → `src/lib/auth.ts` + the `[...nextauth]` route give us the login engine, and Credentials provider checks email/password.  
4) **Handle sign‑up** → an API route (`/api/signup`) hashes the password and creates a user; the signup form just calls it.  
5) **Protect notes** → `/notes` checks the session on the server before showing anything.  
6) **Create/delete notes** → server actions mutate the DB and `revalidatePath` refreshes the list.

We did it this way because each step unlocks the next: without models there is no DB, without the DB there is no auth, without auth you can’t safely show user‑specific notes, and without protected routes you don’t really have a real app. This chain is the “why” of the build.
