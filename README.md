# Purpose In Pain Initiative CIC — Website

Full-stack website for **Purpose In Pain Initiative CIC**, a UK Community Interest Company supporting postpartum
mothers through identity restoration, purpose rebuilding, healing, and women's reproductive & mental health
programs, across the UK, Nigeria and the US.

Tagline: *"Turn your pain into purpose."*

## Stack

- **Frontend:** React + Vite + TypeScript, Tailwind CSS, React Router
- **Backend:** Express + TypeScript, PostgreSQL (via `pg`, plain SQL — no ORM)
- **Payments:** Paystack (Standard Checkout redirect flow — one-time and monthly giving)

## Project structure

```
purpose-in-pain/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.sql       # Full DB schema (idempotent CREATE TABLE IF NOT EXISTS)
│   │   │   ├── seed.sql         # Illustrative placeholder events + blog posts
│   │   │   ├── migrate.ts       # Applies schema + seed, bootstraps first admin user
│   │   │   └── pool.ts          # pg Pool
│   │   ├── middleware/auth.ts   # JWT admin auth guard
│   │   ├── routes/              # volunteers, contact, newsletter, donations, blog, events, admin
│   │   └── index.ts             # Express app entrypoint
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/          # NavBar, Footer, Logo (SVG mark), Layout, NewsletterForm
│   │   ├── pages/                # Home, About, Programs, ProgramDetail, Volunteer, Donate,
│   │   │                         # DonateSuccess, Events, Blog, BlogPost, Contact, admin/*
│   │   └── lib/                  # api.ts, content.ts (brief-sourced copy), adminAuth.ts
│   └── public/assets/
│       ├── team/                 # 8 team headshots
│       └── images/                # mission/vision graphics, event photos, campaign graphics
└── package.json                  # root convenience scripts (concurrently runs both dev servers)
```

## Setup

### 1. Prerequisites

- Node.js 18+ and npm
- A local PostgreSQL server (any recent version)

### 2. Install dependencies

```bash
npm run install:all
```

(or `cd backend && npm install`, `cd frontend && npm install` separately)

### 3. Configure environment variables

**Backend** — copy `backend/.env.example` to `backend/.env` and fill in:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string, e.g. `postgresql://postgres:yourpassword@localhost:5432/purpose_in_pain` |
| `JWT_SECRET` | Long random string used to sign admin dashboard auth tokens |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Used **once** by `npm run migrate` to create the first admin user row |
| `PAYSTACK_SECRET_KEY` | Your Paystack **TEST** secret key (`sk_test_...`) from the Paystack dashboard → Settings → API Keys & Webhooks. Swap for a live key (`sk_live_...`) only when ready to accept real donations. |
| `PAYSTACK_CURRENCY` | Defaults to `GBP` |
| `ALLOWED_ORIGINS` | CORS allow-list, defaults to `http://localhost:5173` |

**Frontend** — copy `frontend/.env.example` to `frontend/.env.local` if you need to point at a
backend running somewhere other than `http://localhost:4000` (in local dev, `vite.config.ts`
proxies `/api` to `http://localhost:4000` automatically, so no frontend env vars are required by
default). Donations use Paystack's server-initiated "Standard Checkout" redirect flow, so no
Paystack **public** key is needed in the frontend for the current implementation.

### 4. Create the database and run migrations

Create an empty Postgres database (name of your choice, matching `DATABASE_URL`), e.g.:

```bash
createdb purpose_in_pain
```

Then apply the schema (and illustrative seed data + bootstrap the first admin user):

```bash
cd backend
npm run migrate:dev
```

This runs `backend/src/db/schema.sql` (idempotent — safe to re-run) and, unless
`SEED_ON_MIGRATE=false`, `backend/src/db/seed.sql` (placeholder events + two blog posts), and
creates an `admin_users` row from `ADMIN_USERNAME` / `ADMIN_PASSWORD` if one doesn't already exist.

### 5. Run the dev servers

From the repo root:

```bash
npm run dev
```

This starts the backend on `http://localhost:4000` and the frontend on `http://localhost:5173`
concurrently. Alternatively, run them in two separate terminals:

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

Visit `http://localhost:5173`. The admin dashboard is at `http://localhost:5173/admin/login`
(sign in with the `ADMIN_USERNAME` / `ADMIN_PASSWORD` you set before running the migration).

### 6. Build for production

```bash
npm run build
```

Builds the backend to `backend/dist` (run with `npm run start --prefix backend`, requires
`npm run migrate --prefix backend` to have been run against the production database first) and the
frontend to `frontend/dist` (deploy as a static site / behind any static host, proxying `/api` to
the backend).

## What was verified end-to-end during development

All of the following were actually run and confirmed working against a real, temporary local
PostgreSQL instance (schema applied via `schema.sql`, seed data via `seed.sql`, plus live HTTP
requests against the running Express server):

- Backend and frontend both type-check cleanly (`tsc --noEmit` on both) and the frontend
  production build (`vite build`) succeeds.
- `schema.sql` applies cleanly to a fresh Postgres database; `seed.sql` loads without error.
- Admin bootstrap from `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars creates a working admin login.
- **Volunteer sign-up form** → `POST /api/volunteers` → row persisted → visible via
  `GET /api/admin/volunteers` (auth-gated).
- **Contact form** → `POST /api/contact` → row persisted → visible via
  `GET /api/admin/contact-messages` (auth-gated).
- **Newsletter signup** (footer, on every page) → `POST /api/newsletter` → row persisted, with
  `ON CONFLICT DO NOTHING` so duplicate emails don't error.
- **Admin login** → `POST /api/admin/login` returns a JWT; protected admin routes correctly return
  `401` without a token and succeed with one.
- **Blog CRUD** (create via admin → appears in public `GET /api/blog` list → delete via admin) and
  **Events CRUD** (create via admin → appears in public `GET /api/events` list → delete via admin).
- **Donation initialization** (`POST /api/donations/initialize`) correctly reaches the real
  Paystack API and relays Paystack's response — confirmed by triggering (and correctly surfacing)
  a real "Invalid key" error from Paystack when tested with a placeholder secret key. **To fully
  test the checkout redirect and payment verification, add a real Paystack TEST secret key to
  `backend/.env` and re-test** (see "Placeholders / TODO" below).
- The frontend dev server correctly proxies `/api/*` to the backend, and every page route
  (Home, About, Programs + all 4 program detail pages, Volunteer, Donate, Events, Blog, Contact,
  Admin login) renders without errors.

### A note on the local Postgres verification

This machine's own local PostgreSQL 18 service (used for other projects) was left completely
unmodified — no passwords were reset and no authentication config was touched. Verification above
was done against a separate, throwaway PostgreSQL data directory created and destroyed purely for
this test, so the working `schema.sql` / `seed.sql` / migration flow shown above is a faithful
proof that the same steps will work against **your** local Postgres once you set a real
`DATABASE_URL` in `backend/.env`.

## Placeholders / TODO for the real client to fill in

- **Logo:** `frontend/public/assets/brand/logo-mark.png` and `logo-full.png` are raster crops taken
  directly from the client's own campaign artwork (the "mission statement" graphic shared over
  WhatsApp), with the white background keyed out to transparency. This is real client artwork, not
  an invented placeholder — but it's a raster crop, not a vector file, so edges may not scale
  perfectly at very large sizes. Swap for the client's real high-res/vector logo file once
  available (update `frontend/src/components/Logo.tsx`).
- **Paystack live keys:** `backend/.env` ships with placeholder `sk_test_...` values. Add real
  Paystack **test** keys to develop against, and only switch to **live** keys
  (`PAYSTACK_SECRET_KEY=sk_live_...`) when ready to accept real donations.
- **Email delivery (SMTP):** Now fully wired up (see `backend/src/lib/mailer.ts`) — contact-form
  and volunteer-signup submissions trigger a notification email to `purposeinpain1@gmail.com`
  (configurable via `NOTIFICATION_EMAIL`), and successful donations trigger a receipt email to the
  donor using the exact thank-you text from the brief. **It is inactive until you set
  `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` in `backend/.env`** — until then, forms still work fully
  (submissions are always saved to Postgres and visible in the admin dashboard), email sending is
  just skipped with a logged warning. See the SMTP section of `backend/.env.example` for Gmail App
  Password setup instructions. The aspirational `info@pipinitiatives.org` domain email mentioned in
  the brief is not yet configured — continue using `purposeinpain1@gmail.com` until that's set up.
- **Team photo-to-name pairing:** The brief explicitly flagged that the mapping between the 8 team
  member names and the extracted headshot files was best-effort / not confirmed. This build pairs
  the 8 names (in the order given in the brief's "Team" section, Director first) with 8 of the
  available headshots (`IMG_7146` → `IMG_7156`, in numeric order) — see
  `frontend/src/lib/content.ts` (`teamMembers`). **Please confirm/correct this pairing** with the
  client before publishing.
- **Events:** Seeded events in `backend/src/db/seed.sql` are explicitly illustrative placeholders
  (dates computed relative to migration time) — replace with real event details via the admin
  dashboard (Events tab) before launch.
- **Paystack webhook signature verification:** `POST /api/donations/webhook` verifies Paystack's
  `x-paystack-signature` header using the raw JSON body; for full production correctness this
  should verify against the exact raw request bytes (Express's `express.json()` already parses the
  body before this handler runs) — fine for now given the redirect+verify flow is the primary path,
  but worth hardening (e.g. with `express.raw()` on this specific route) before relying on the
  webhook alone in production.
- **Monthly giving / Paystack Plans:** Monthly donations create a Paystack Plan on the fly per
  distinct amount and initialize the transaction against it, so Paystack will auto-bill the donor
  monthly after their first successful charge. This is standard Paystack subscription behaviour,
  but hasn't been tested against a live Paystack test account (needs a real test secret key — see
  above).

## Deploying to Render (preview)

This repo includes a `render.yaml` Blueprint that provisions all three pieces in one shot: a free
Postgres database, the backend as a Node web service, and the frontend as a static site.

1. Push this repo to GitHub (Render Blueprints deploy from a connected Git repo).
2. In the Render dashboard: **New → Blueprint**, select this repo. Render will detect `render.yaml`
   and show a preview of the 3 resources it's about to create (`purpose-in-pain-db`,
   `purpose-in-pain-api`, `purpose-in-pain-web`) — click **Apply**.
3. First deploy takes a few minutes (backend build → migration → start; frontend build → static
   publish). Free-tier services spin down after inactivity and take ~30–60s to wake back up on the
   next request — normal for a preview link, not a bug.
4. The blueprint predicts each service's URL from its `name:` field
   (`https://purpose-in-pain-api.onrender.com`, `https://purpose-in-pain-web.onrender.com`) and
   wires `ALLOWED_ORIGINS` / `VITE_API_BASE_URL` to match. **If Render appends a random suffix to
   either name** (only happens if those exact names are already taken on Render), update the other
   service's corresponding env var in the dashboard to the real URL, then trigger a manual redeploy
   of the frontend (Vite env vars are baked in at build time, so this won't take effect until it
   rebuilds).
5. Admin login for the preview: username `admin`, password `PreviewPIP2026!` (set via `render.yaml`
   — change this in the dashboard Environment tab before sharing the link widely).
6. `PAYSTACK_SECRET_KEY` ships as a placeholder (`sk_test_placeholder`) so the site deploys without
   a real Paystack account — the Donate flow will show a real "Invalid key" error from Paystack
   until you set a real test key in the backend service's Environment tab.
7. Real SMTP delivery is off by default on this preview (no `SMTP_*` vars set) — forms still work
   and store to Postgres, just without outbound email. Add `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` in
   the backend service's Environment tab to turn it on (see `backend/.env.example`).

## Content sourcing

All page copy is grounded directly in the client-provided content brief (mission/vision
statements, problem/gap/solution, the four program pillars, volunteer team list, donation preset
amounts and thank-you note, team names, contact details and social links) — nothing was invented
beyond writing original, expanded paragraph copy for the Program detail pages and blog seed posts,
as requested.
