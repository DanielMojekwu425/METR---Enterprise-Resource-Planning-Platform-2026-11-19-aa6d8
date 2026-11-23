-- 3Metr ERP Waitlist Database Schema
-- Compatible with PostgreSQL 14+, Neon, and Supabase

CREATE TABLE IF NOT EXISTS waitlist_signups (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name           TEXT NOT NULL,
  work_email          TEXT NOT NULL,
  organization        TEXT NOT NULL,
  role                TEXT NOT NULL,          -- Fixed list: Founder / CEO, Finance / Accounting, Operations, Sales, IT / Engineering, Other
  company_structure   TEXT NOT NULL,         -- Fixed list: Single Legal Entity (1 Company), 2–5 Legal Entities (Multi-Currency), 6+ Legal Entities / Holding Group
  interest_phase1     BOOLEAN NOT NULL DEFAULT false,
  interest_phase2     BOOLEAN NOT NULL DEFAULT false,
  interest_phase3     BOOLEAN NOT NULL DEFAULT false,
  current_tools_notes TEXT,
  consent_given_at    TIMESTAMPTZ NOT NULL,   -- Timestamp when user agreed to privacy terms
  consent_version     TEXT NOT NULL,          -- Privacy notice version
  verification_token  TEXT,                   -- Cryptographic token for double opt-in email verification
  email_verified_at   TIMESTAMPTZ,            -- NULL until confirmation link is clicked
  source              TEXT,                   -- UTM source / referrer tracking
  status              TEXT NOT NULL DEFAULT 'new', -- new -> verified -> contacted -> interviewed -> pilot_candidate -> invited -> converted
  internal_notes      TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Case-insensitive unique index on work_email to prevent duplicate signups
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_signups_email_lower_idx ON waitlist_signups (lower(work_email));

-- Index for fast token lookups during double opt-in verification
CREATE INDEX IF NOT EXISTS waitlist_signups_verification_token_idx ON waitlist_signups (verification_token) WHERE verification_token IS NOT NULL;

-- Index for status filtering in admin pipeline
CREATE INDEX IF NOT EXISTS waitlist_signups_status_idx ON waitlist_signups (status);
