/**
 * @metr/contracts — Canonical domain types, financial invariants, state machines,
 * and validation contracts derived from 3Metr-SPEC-001 (v1.0).
 */

export type ReleasePhase = 'Phase 1' | 'Phase 2' | 'Phase 3';

export type PriorityLevel = 'P0' | 'P1' | 'P2';

export type CurrencyCode = 'NGN' | 'GBP' | 'USD' | 'EUR';

export interface JournalLineInput {
  accountCode: string;
  accountName: string;
  debitBase: string; // Decimal string matching numeric(20,4)
  creditBase: string; // Decimal string matching numeric(20,4)
  partyRef?: string;
}

export interface JournalValidationResult {
  valid: boolean;
  totalDebitMinor: bigint;
  totalCreditMinor: bigint;
  imbalanceMinor: bigint;
  formattedDebit: string;
  formattedCredit: string;
  errors: string[];
}

export interface QuoteLineInput {
  sku: string;
  description: string;
  quantity: string;
  unitPrice: string;
  discountPercent?: string;
  taxRatePercent?: string;
}

export interface QuoteTotals {
  subtotal: string;
  discountTotal: string;
  taxTotal: string;
  grandTotal: string;
}

export type DocumentType =
  | 'lead'
  | 'quotation'
  | 'sales_order'
  | 'invoice'
  | 'purchase_order'
  | 'journal';

export const ALLOWED_TRANSITIONS: Record<DocumentType, Record<string, string[]>> = {
  lead: {
    new: ['contacted', 'disqualified'],
    contacted: ['qualified', 'disqualified'],
    qualified: ['converted', 'disqualified'],
    converted: [],
    disqualified: [],
  },
  quotation: {
    draft: ['submitted'],
    submitted: ['approved', 'rejected'],
    approved: ['sent', 'expired'],
    sent: ['accepted', 'expired', 'rejected'],
    accepted: [],
    expired: [],
    rejected: [],
  },
  sales_order: {
    draft: ['confirmed', 'cancelled'],
    confirmed: ['fulfilling', 'cancelled'],
    fulfilling: ['fulfilled'],
    fulfilled: [],
    cancelled: [],
  },
  invoice: {
    draft: ['issued', 'voided'],
    issued: ['part_paid', 'paid', 'overdue', 'voided'],
    part_paid: ['paid', 'overdue'],
    overdue: ['part_paid', 'paid'],
    paid: [],
    voided: [],
  },
  purchase_order: {
    draft: ['submitted'],
    submitted: ['approved'],
    approved: ['sent'],
    sent: ['part_received', 'received'],
    part_received: ['received', 'closed'],
    received: ['closed'],
    closed: [],
  },
  journal: {
    draft: ['pending_approval'],
    pending_approval: ['posted'],
    posted: ['reversed'],
    reversed: [],
  },
};

const SCALE_DIGITS = 4n;
const SCALE_FACTOR = 10000n;

/**
 * Parses a decimal string into fixed-point bigint with 4 fractional digits (numeric(20,4)).
 * Avoids IEEE-754 floating-point arithmetic per 3Metr-SPEC-001 Section B7.
 */
export function parseDecimalToScaled(raw: string): bigint {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) {
    throw new Error(`Invalid decimal value: "${raw}"`);
  }
  const negative = cleaned.startsWith('-');
  const unsigned = negative ? cleaned.slice(1) : cleaned;
  const [intPart, fracPart = ''] = unsigned.split('.');
  const paddedFrac = (fracPart + '0000').slice(0, Number(SCALE_DIGITS));
  const scaled = BigInt(intPart) * SCALE_FACTOR + BigInt(paddedFrac);
  return negative ? -scaled : scaled;
}

/**
 * Formats a 4-decimal scaled bigint to standard 2-decimal display currency string.
 */
export function formatScaledCurrency(scaled: bigint, decimals: 2 | 4 = 2): string {
  const negative = scaled < 0n;
  const abs = negative ? -scaled : scaled;
  const divisor = decimals === 2 ? 100n : 1n;
  const rounded = decimals === 2 ? (abs + 50n) / divisor : abs;
  const mod = decimals === 2 ? 100n : 10000n;
  const intPart = rounded / mod;
  const fracPart = (rounded % mod).toString().padStart(decimals, '0');
  const withCommas = intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${negative ? '-' : ''}${withCommas}.${fracPart}`;
}

/**
 * Validates double-entry journal posting invariants per 3Metr-SPEC-001 Section B7:
 * - Period must be open
 * - At least 2 lines
 * - Non-negative amounts
 * - Each line strictly debit OR credit (never both, never zero/zero)
 * - SUM(debit_base) === SUM(credit_base)
 */
export function validateJournalEntry(
  lines: JournalLineInput[],
  fiscalPeriodStatus: 'open' | 'closed'
): JournalValidationResult {
  const errors: string[] = [];

  if (fiscalPeriodStatus !== 'open') {
    errors.push('Fiscal period is closed; backdated postings require controlled reopening approval.');
  }

  if (lines.length < 2) {
    errors.push('A posted journal entry must contain at least two lines.');
  }

  let totalDebit = 0n;
  let totalCredit = 0n;

  lines.forEach((line, idx) => {
    const debit = parseDecimalToScaled(line.debitBase);
    const credit = parseDecimalToScaled(line.creditBase);

    if (debit < 0n || credit < 0n) {
      errors.push(`Line ${idx + 1} (${line.accountCode}): negative amounts are forbidden.`);
    }
    if ((debit > 0n && credit > 0n) || (debit === 0n && credit === 0n)) {
      errors.push(
        `Line ${idx + 1} (${line.accountCode}): must specify strictly either a positive debit or positive credit.`
      );
    }

    totalDebit += debit;
    totalCredit += credit;
  });

  const imbalance = totalDebit - totalCredit;
  if (imbalance !== 0n) {
    errors.push(
      `Journal entry is out of balance by ${formatScaledCurrency(imbalance < 0n ? -imbalance : imbalance)}.`
    );
  }

  return {
    valid: errors.length === 0,
    totalDebitMinor: totalDebit,
    totalCreditMinor: totalCredit,
    imbalanceMinor: imbalance,
    formattedDebit: formatScaledCurrency(totalDebit),
    formattedCredit: formatScaledCurrency(totalCredit),
    errors,
  };
}

/**
 * Computes exact quote totals using scaled integer arithmetic (no IEEE float rounding drift).
 */
export function calculateQuoteTotals(lines: QuoteLineInput[]): QuoteTotals {
  let subtotal = 0n;
  let discountTotal = 0n;
  let taxTotal = 0n;

  for (const line of lines) {
    const qty = parseDecimalToScaled(line.quantity);
    const unitPrice = parseDecimalToScaled(line.unitPrice);
    const discountPct = parseDecimalToScaled(line.discountPercent ?? '0');
    const taxPct = parseDecimalToScaled(line.taxRatePercent ?? '0');

    if (qty <= 0n) {
      throw new Error(`Line "${line.sku}": quantity must be positive.`);
    }
    if (discountPct < 0n) {
      throw new Error(`Line "${line.sku}": negative discounts are forbidden.`);
    }

    const gross = (qty * unitPrice) / SCALE_FACTOR;
    const discount = (gross * discountPct) / (100n * SCALE_FACTOR);
    const net = gross - discount;
    const tax = (net * taxPct) / (100n * SCALE_FACTOR);

    subtotal += gross;
    discountTotal += discount;
    taxTotal += tax;
  }

  const grandTotal = subtotal - discountTotal + taxTotal;

  return {
    subtotal: formatScaledCurrency(subtotal),
    discountTotal: formatScaledCurrency(discountTotal),
    taxTotal: formatScaledCurrency(taxTotal),
    grandTotal: formatScaledCurrency(grandTotal),
  };
}

/**
 * Checks whether a document state transition is permitted per 3Metr-SPEC-001 Section A7.
 */
export function canTransitionDocument(
  docType: DocumentType,
  fromStatus: string,
  toStatus: string
): boolean {
  const allowed = ALLOWED_TRANSITIONS[docType]?.[fromStatus];
  if (!allowed) return false;
  return allowed.includes(toStatus);
}

/**
 * Waitlist & Pilot Access Request Contract
 */
export const WAITLIST_ROLES = [
  'Founder / CEO',
  'Finance / Accounting',
  'Operations',
  'Sales',
  'IT / Engineering',
  'Other',
] as const;

export type WaitlistRole = (typeof WAITLIST_ROLES)[number];

export const WAITLIST_COMPANY_STRUCTURES = [
  'Single Legal Entity (1 Company)',
  '2–5 Legal Entities (Multi-Currency)',
  '6+ Legal Entities / Holding Group',
] as const;

export type WaitlistCompanyStructure = (typeof WAITLIST_COMPANY_STRUCTURES)[number];

export const WAITLIST_STATUSES = [
  'new',
  'verified',
  'contacted',
  'interviewed',
  'pilot_candidate',
  'invited',
  'converted',
] as const;

export type WaitlistStatus = (typeof WAITLIST_STATUSES)[number];

export interface WaitlistSubmissionInput {
  fullName: string;
  workEmail: string;
  organization: string;
  companyName?: string; // Backward compatibility alias
  role: string;
  companyStructure: string;
  entityCount?: string; // Backward compatibility alias
  priorityPhases: ReleasePhase[];
  notes?: string;
  consentGiven: boolean;
  consentVersion?: string;
  source?: string;
  website?: string; // Honeypot anti-bot field (should always be empty)
}

export interface WaitlistValidationResult {
  valid: boolean;
  fieldErrors: Partial<Record<keyof WaitlistSubmissionInput, string>>;
}

export interface WaitlistRecord {
  id: string;
  referenceCode: string;
  fullName: string;
  workEmail: string;
  organization: string;
  companyName: string; // compatibility
  role: string;
  companyStructure: string;
  entityCount: string; // compatibility
  priorityPhases: ReleasePhase[];
  interestPhase1: boolean;
  interestPhase2: boolean;
  interestPhase3: boolean;
  currentToolsNotes?: string;
  notes?: string;
  consentGivenAt: string;
  consentVersion: string;
  status: WaitlistStatus;
  emailVerified: boolean;
  emailVerifiedAt?: string | null;
  submittedAt: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateWaitlistSubmission(
  input: WaitlistSubmissionInput
): WaitlistValidationResult {
  const fieldErrors: Partial<Record<keyof WaitlistSubmissionInput, string>> = {};

  if (!input.fullName || input.fullName.trim().length < 2) {
    fieldErrors.fullName = 'Enter your full name (at least 2 characters).';
  }

  const email = (input.workEmail || '').trim().toLowerCase();
  if (!email || !EMAIL_PATTERN.test(email)) {
    fieldErrors.workEmail = 'Enter a valid work email address.';
  }

  const org = (input.organization || input.companyName || '').trim();
  if (!org || org.length < 2) {
    fieldErrors.organization = 'Enter your organization or legal entity name.';
  }

  const role = (input.role || '').trim();
  if (!role || !WAITLIST_ROLES.includes(role as WaitlistRole)) {
    fieldErrors.role = 'Select your operational role from the list.';
  }

  const structure = (input.companyStructure || input.entityCount || '').trim();
  if (!structure || !WAITLIST_COMPANY_STRUCTURES.includes(structure as WaitlistCompanyStructure)) {
    fieldErrors.companyStructure = 'Select your legal entity structure from the list.';
  }

  if (!input.priorityPhases || input.priorityPhases.length === 0) {
    fieldErrors.priorityPhases = 'Select at least one priority rollout phase.';
  }

  if (input.consentGiven !== true) {
    fieldErrors.consentGiven = 'You must agree to the privacy notice to proceed.';
  }

  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}
