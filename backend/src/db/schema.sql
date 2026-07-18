-- Purpose In Pain Initiative CIC — Database Schema
-- Run with: psql "$DATABASE_URL" -f src/db/schema.sql
-- (or via `npm run migrate` which applies this file idempotently)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── Admin users ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Volunteer sign-ups ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS volunteer_signups (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  location      TEXT,              -- e.g. "UK", "Nigeria", "US" + free text timezone
  teams         TEXT[] NOT NULL DEFAULT '{}',  -- multi-select of team names
  availability  TEXT,
  reason        TEXT,              -- "why do you want to volunteer"
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Contact form submissions ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  message       TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Newsletter subscribers ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Donations ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference         TEXT NOT NULL UNIQUE,      -- Paystack transaction reference
  email             TEXT NOT NULL,
  donor_name        TEXT,
  amount_pence      INTEGER NOT NULL,           -- amount in minor currency unit (pence)
  currency          TEXT NOT NULL DEFAULT 'GBP',
  frequency         TEXT NOT NULL DEFAULT 'one-time', -- 'one-time' | 'monthly'
  status            TEXT NOT NULL DEFAULT 'pending',   -- 'pending' | 'success' | 'failed'
  paystack_plan_code TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified_at       TIMESTAMPTZ
);

-- ─── Blog / News posts ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  excerpt       TEXT,
  body          TEXT NOT NULL,       -- plain text / markdown
  cover_image   TEXT,
  author        TEXT,
  published     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Events ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  location      TEXT,          -- e.g. "Zoom (Online)" or a city
  event_date    TIMESTAMPTZ NOT NULL,
  image         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts (published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON events (event_date);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations (status);
