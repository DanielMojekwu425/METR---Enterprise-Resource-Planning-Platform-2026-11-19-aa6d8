import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateQuoteTotals,
  canTransitionDocument,
  validateJournalEntry,
  validateWaitlistSubmission,
} from './erp';

test('validateJournalEntry accepts balanced multi-line entry in open period', () => {
  const result = validateJournalEntry(
    [
      {
        accountCode: '1100',
        accountName: 'Accounts Receivable',
        debitBase: '1850000.00',
        creditBase: '0',
      },
      {
        accountCode: '4010',
        accountName: 'Hardware & Licensing Revenue',
        debitBase: '0',
        creditBase: '1500000.00',
      },
      {
        accountCode: '4020',
        accountName: 'Implementation Services Revenue',
        debitBase: '0',
        creditBase: '350000.00',
      },
    ],
    'open'
  );

  assert.equal(result.valid, true);
  assert.equal(result.formattedDebit, '1,850,000.00');
  assert.equal(result.formattedCredit, '1,850,000.00');
  assert.equal(result.imbalanceMinor, 0n);
});

test('validateJournalEntry rejects unbalanced posting (UAT-04) and closed fiscal period (UAT-13)', () => {
  const unbalanced = validateJournalEntry(
    [
      { accountCode: '1100', accountName: 'AR', debitBase: '1000.00', creditBase: '0' },
      { accountCode: '4010', accountName: 'Revenue', debitBase: '0', creditBase: '900.00' },
    ],
    'open'
  );
  assert.equal(unbalanced.valid, false);
  assert.match(unbalanced.errors[0], /out of balance by 100\.00/);

  const closedPeriod = validateJournalEntry(
    [
      { accountCode: '1100', accountName: 'AR', debitBase: '500.00', creditBase: '0' },
      { accountCode: '4010', accountName: 'Revenue', debitBase: '0', creditBase: '500.00' },
    ],
    'closed'
  );
  assert.equal(closedPeriod.valid, false);
  assert.match(closedPeriod.errors[0], /Fiscal period is closed/);
});

test('calculateQuoteTotals computes exact fixed-point totals matching 3Metr D5 payload', () => {
  const totals = calculateQuoteTotals([
    {
      sku: 'FW-NG-400',
      description: 'Next-Gen Enterprise Firewall Appliance',
      quantity: '1',
      unitPrice: '1500000.00',
      taxRatePercent: '7.5',
    },
    {
      sku: 'SVC-INST-01',
      description: 'On-Site Deployment & Hardening Service',
      quantity: '1',
      unitPrice: '350000.00',
      taxRatePercent: '7.5',
    },
  ]);

  assert.equal(totals.subtotal, '1,850,000.00');
  assert.equal(totals.discountTotal, '0.00');
  assert.equal(totals.taxTotal, '138,750.00');
  assert.equal(totals.grandTotal, '1,988,750.00');
});

test('canTransitionDocument enforces A7 state machine invariants', () => {
  assert.equal(canTransitionDocument('quotation', 'approved', 'sent'), true);
  assert.equal(canTransitionDocument('quotation', 'accepted', 'draft'), false);
  assert.equal(canTransitionDocument('journal', 'posted', 'reversed'), true);
  assert.equal(canTransitionDocument('journal', 'posted', 'draft'), false);
  assert.equal(canTransitionDocument('invoice', 'issued', 'part_paid'), true);
});

test('validateWaitlistSubmission validates required fields, fixed enums, and consent', () => {
  const invalid = validateWaitlistSubmission({
    fullName: '',
    workEmail: 'not-an-email',
    organization: '',
    role: 'Random Unlisted Title',
    companyStructure: 'Invalid structure',
    priorityPhases: [],
    consentGiven: false,
  });

  assert.equal(invalid.valid, false);
  assert.ok(invalid.fieldErrors.fullName);
  assert.ok(invalid.fieldErrors.workEmail);
  assert.ok(invalid.fieldErrors.organization);
  assert.ok(invalid.fieldErrors.role);
  assert.ok(invalid.fieldErrors.companyStructure);
  assert.ok(invalid.fieldErrors.priorityPhases);
  assert.ok(invalid.fieldErrors.consentGiven);

  const valid = validateWaitlistSubmission({
    fullName: 'Adaeze Okonkwo',
    workEmail: 'Adaeze@Meridian-Ops.NG',
    organization: 'Meridian Systems Ltd',
    role: 'Finance / Accounting',
    companyStructure: '2–5 Legal Entities (Multi-Currency)',
    priorityPhases: ['Phase 1', 'Phase 2'],
    consentGiven: true,
  });

  assert.equal(valid.valid, true);
  assert.deepEqual(valid.fieldErrors, {});
});
