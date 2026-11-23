import crypto from 'node:crypto';
import pg from 'pg';
import type { ValidatedWaitlistData } from './validation';
import type { WaitlistRecord, WaitlistStatus } from '../packages/contracts/src/erp';

const { Pool } = pg;

export interface DbWaitlistRow {
  id: string;
  full_name: string;
  work_email: string;
  organization: string;
  role: string;
  company_structure: string;
  interest_phase1: boolean;
  interest_phase2: boolean;
  interest_phase3: boolean;
  current_tools_notes: string | null;
  consent_given_at: Date;
  consent_version: string;
  verification_token: string | null;
  email_verified_at: Date | null;
  source: string | null;
  status: WaitlistStatus;
  internal_notes: string | null;
  created_at: Date;
}

let pool: pg.Pool | null = null;
let isConnected = false;

// In-memory fallback if DATABASE_URL is not yet configured
const inMemorySignups: DbWaitlistRow[] = [];

export function isDbConnected(): boolean {
  return isConnected;
}

export async function initDb(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl || databaseUrl.includes('YOUR-PROJECT-REF')) {
    console.warn(
      '⚠️  [3Metr DB] No live DATABASE_URL detected. Running with in-memory ledger. Set DATABASE_URL in .env to connect to your Supabase/Postgres database.'
    );
    return;
  }

  try {
    const isRemote =
      databaseUrl.includes('supabase.co') ||
      databaseUrl.includes('neon.tech') ||
      databaseUrl.includes('sslmode=require');

    pool = new Pool({
      connectionString: databaseUrl,
      ssl: isRemote ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
    });

    // Test connection
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS waitlist_signups (
          id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          full_name           TEXT NOT NULL,
          work_email          TEXT NOT NULL,
          organization        TEXT NOT NULL,
          role                TEXT NOT NULL,
          company_structure   TEXT NOT NULL,
          interest_phase1     BOOLEAN NOT NULL DEFAULT false,
          interest_phase2     BOOLEAN NOT NULL DEFAULT false,
          interest_phase3     BOOLEAN NOT NULL DEFAULT false,
          current_tools_notes TEXT,
          consent_given_at    TIMESTAMPTZ NOT NULL,
          consent_version     TEXT NOT NULL,
          verification_token  TEXT,
          email_verified_at   TIMESTAMPTZ,
          source              TEXT,
          status              TEXT NOT NULL DEFAULT 'new',
          internal_notes      TEXT,
          created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
        );

        CREATE UNIQUE INDEX IF NOT EXISTS waitlist_signups_email_lower_idx ON waitlist_signups (lower(work_email));
        CREATE INDEX IF NOT EXISTS waitlist_signups_verification_token_idx ON waitlist_signups (verification_token) WHERE verification_token IS NOT NULL;
        CREATE INDEX IF NOT EXISTS waitlist_signups_status_idx ON waitlist_signups (status);
      `);
      isConnected = true;
      console.log('✅ [3Metr DB] Connected to PostgreSQL database and verified waitlist_signups table.');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('❌ [3Metr DB] Failed to connect to PostgreSQL. Falling back to in-memory ledger:', err);
    isConnected = false;
    pool = null;
  }
}

export function formatDbRowToRecord(row: DbWaitlistRow, indexNumber: number): WaitlistRecord {
  const seq = String(indexNumber).padStart(4, '0');
  const phases: ('Phase 1' | 'Phase 2' | 'Phase 3')[] = [];
  if (row.interest_phase1) phases.push('Phase 1');
  if (row.interest_phase2) phases.push('Phase 2');
  if (row.interest_phase3) phases.push('Phase 3');

  return {
    id: row.id,
    referenceCode: `3Metr-PLT-2026-${seq}`,
    fullName: row.full_name,
    workEmail: row.work_email,
    organization: row.organization,
    companyName: row.organization,
    role: row.role,
    companyStructure: row.company_structure,
    entityCount: row.company_structure,
    priorityPhases: phases,
    interestPhase1: row.interest_phase1,
    interestPhase2: row.interest_phase2,
    interestPhase3: row.interest_phase3,
    currentToolsNotes: row.current_tools_notes || undefined,
    notes: row.current_tools_notes || undefined,
    consentGivenAt: row.consent_given_at instanceof Date ? row.consent_given_at.toISOString() : String(row.consent_given_at),
    consentVersion: row.consent_version,
    status: row.status,
    emailVerified: Boolean(row.email_verified_at),
    emailVerifiedAt: row.email_verified_at ? (row.email_verified_at instanceof Date ? row.email_verified_at.toISOString() : String(row.email_verified_at)) : null,
    submittedAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  };
}

export async function insertWaitlistSignup(
  data: ValidatedWaitlistData,
  verificationToken: string
): Promise<{ row: DbWaitlistRow; isDuplicate: boolean }> {
  const normalizedEmail = data.workEmail.trim().toLowerCase();
  const consentGivenAt = new Date();

  const interestPhase1 = data.priorityPhases.includes('Phase 1');
  const interestPhase2 = data.priorityPhases.includes('Phase 2');
  const interestPhase3 = data.priorityPhases.includes('Phase 3');

  if (pool && isConnected) {
    try {
      const res = await pool.query<DbWaitlistRow>(
        `INSERT INTO waitlist_signups (
          full_name,
          work_email,
          organization,
          role,
          company_structure,
          interest_phase1,
          interest_phase2,
          interest_phase3,
          current_tools_notes,
          consent_given_at,
          consent_version,
          verification_token,
          source,
          status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'new')
        RETURNING *`,
        [
          data.fullName,
          normalizedEmail,
          data.organization,
          data.role,
          data.companyStructure,
          interestPhase1,
          interestPhase2,
          interestPhase3,
          data.notes || null,
          consentGivenAt,
          data.consentVersion,
          verificationToken,
          data.source || null,
        ]
      );
      return { row: res.rows[0], isDuplicate: false };
    } catch (err: unknown) {
      // Postgres error 23505 = unique_violation
      if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === '23505') {
        const existing = await findSignupByEmail(normalizedEmail);
        if (existing) {
          return { row: existing, isDuplicate: true };
        }
      }
      throw err;
    }
  }

  // In-memory fallback
  const existing = inMemorySignups.find((s) => s.work_email.toLowerCase() === normalizedEmail);
  if (existing) {
    return { row: existing, isDuplicate: true };
  }

  const row: DbWaitlistRow = {
    id: crypto.randomUUID(),
    full_name: data.fullName,
    work_email: normalizedEmail,
    organization: data.organization,
    role: data.role,
    company_structure: data.companyStructure,
    interest_phase1: interestPhase1,
    interest_phase2: interestPhase2,
    interest_phase3: interestPhase3,
    current_tools_notes: data.notes || null,
    consent_given_at: consentGivenAt,
    consent_version: data.consentVersion,
    verification_token: verificationToken,
    email_verified_at: null,
    source: data.source || null,
    status: 'new',
    internal_notes: null,
    created_at: new Date(),
  };

  inMemorySignups.push(row);
  return { row, isDuplicate: false };
}

export async function findSignupByEmail(email: string): Promise<DbWaitlistRow | null> {
  const normalized = email.trim().toLowerCase();

  if (pool && isConnected) {
    const res = await pool.query<DbWaitlistRow>(
      'SELECT * FROM waitlist_signups WHERE lower(work_email) = $1 LIMIT 1',
      [normalized]
    );
    return res.rows[0] || null;
  }

  return inMemorySignups.find((s) => s.work_email.toLowerCase() === normalized) || null;
}

export async function verifyWaitlistEmail(
  token: string
): Promise<{ success: boolean; row: DbWaitlistRow | null; alreadyVerified: boolean }> {
  if (!token || token.trim().length === 0) {
    return { success: false, row: null, alreadyVerified: false };
  }

  if (pool && isConnected) {
    // Check if token exists
    const findRes = await pool.query<DbWaitlistRow>(
      'SELECT * FROM waitlist_signups WHERE verification_token = $1 LIMIT 1',
      [token]
    );

    if (findRes.rows.length === 0) {
      return { success: false, row: null, alreadyVerified: false };
    }

    const current = findRes.rows[0];
    if (current.email_verified_at) {
      return { success: true, row: current, alreadyVerified: true };
    }

    // Update to verified
    const updateRes = await pool.query<DbWaitlistRow>(
      `UPDATE waitlist_signups
       SET email_verified_at = now(),
           status = CASE WHEN status = 'new' THEN 'verified' ELSE status END,
           verification_token = NULL
       WHERE id = $1
       RETURNING *`,
      [current.id]
    );

    return { success: true, row: updateRes.rows[0], alreadyVerified: false };
  }

  // In-memory fallback
  const entry = inMemorySignups.find((s) => s.verification_token === token);
  if (!entry) {
    return { success: false, row: null, alreadyVerified: false };
  }

  if (entry.email_verified_at) {
    return { success: true, row: entry, alreadyVerified: true };
  }

  entry.email_verified_at = new Date();
  if (entry.status === 'new') {
    entry.status = 'verified';
  }
  entry.verification_token = null;

  return { success: true, row: entry, alreadyVerified: false };
}

export async function getWaitlistCount(): Promise<number> {
  const BASELINE_COUNT = 38;

  if (pool && isConnected) {
    try {
      const res = await pool.query<{ count: string }>(
        'SELECT count(*) FROM waitlist_signups'
      );
      const count = parseInt(res.rows[0]?.count || '0', 10);
      return BASELINE_COUNT + count;
    } catch (err) {
      console.error('Error fetching waitlist count from DB:', err);
    }
  }

  return BASELINE_COUNT + inMemorySignups.length;
}
