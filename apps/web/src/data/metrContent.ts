import type { CurrencyCode, JournalLineInput, ReleasePhase } from '@metr/contracts';
import type { AccordionItemData, WorkflowStage } from '@metr/ui';

export interface LegalEntityDemo {
  id: string;
  legalName: string;
  shortName: string;
  currency: CurrencyCode;
  symbol: string;
  fiscalPeriod: string;
  periodStatus: 'open' | 'closed';
  quoteNumber: string;
  orderNumber: string;
  invoiceNumber: string;
  journalNumber: string;
  customerParty: string;
  arOutstanding: string;
  postedJournalsCount: string;
  quoteTotal: string;
  lines: {
    sku: string;
    description: string;
    qty: string;
    unitPrice: string;
    lineTotal: string;
  }[];
  journalLines: JournalLineInput[];
  partialPaymentAmount: string;
  remainingAfterPayment: string;
}

export const LEGAL_ENTITY_DEMOS: LegalEntityDemo[] = [
  {
    id: 'meridian-ng',
    legalName: 'Meridian Tech NG Ltd',
    shortName: 'Meridian NG (NGN)',
    currency: 'NGN',
    symbol: '₦',
    fiscalPeriod: 'Nov 2026',
    periodStatus: 'open',
    quoteNumber: 'QT-NG-2026-0418-R2',
    orderNumber: 'SO-NG-2026-0194',
    invoiceNumber: 'INV-NG-2026-0882',
    journalNumber: 'JE-NG-2026-4419',
    customerParty: 'Zenith Infrastructure Partners Ltd',
    arOutstanding: '₦14,820,000.00',
    postedJournalsCount: '1,248',
    quoteTotal: '₦1,988,750.00',
    lines: [
      {
        sku: 'FW-NG-400',
        description: 'Enterprise Firewall Appliance',
        qty: '1.00',
        unitPrice: '1,500,000.00',
        lineTotal: '1,500,000.00',
      },
      {
        sku: 'SVC-INST-01',
        description: 'Deployment & Hardening Service',
        qty: '1.00',
        unitPrice: '350,000.00',
        lineTotal: '350,000.00',
      },
      {
        sku: 'TAX-VAT-75',
        description: 'VAT @ 7.5% (Standard Rate)',
        qty: '1.00',
        unitPrice: '138,750.00',
        lineTotal: '138,750.00',
      },
    ],
    journalLines: [
      {
        accountCode: '1100',
        accountName: 'Accounts Receivable — Trade',
        debitBase: '1988750.00',
        creditBase: '0.00',
        partyRef: 'PTY-0084',
      },
      {
        accountCode: '4010',
        accountName: 'Hardware & Licence Revenue',
        debitBase: '0.00',
        creditBase: '1500000.00',
      },
      {
        accountCode: '4020',
        accountName: 'Implementation Services Revenue',
        debitBase: '0.00',
        creditBase: '350000.00',
      },
      {
        accountCode: '2140',
        accountName: 'VAT Output Liability',
        debitBase: '0.00',
        creditBase: '138750.00',
      },
    ],
    partialPaymentAmount: '1,000,000.00',
    remainingAfterPayment: '988,750.00',
  },
  {
    id: 'meridian-uk',
    legalName: 'Meridian Advisory UK Ltd',
    shortName: 'Meridian UK (GBP)',
    currency: 'GBP',
    symbol: '£',
    fiscalPeriod: 'Nov 2026',
    periodStatus: 'open',
    quoteNumber: 'QT-UK-2026-0112-R1',
    orderNumber: 'SO-UK-2026-0063',
    invoiceNumber: 'INV-UK-2026-0219',
    journalNumber: 'JE-UK-2026-1092',
    customerParty: 'Northbridge Logistics Group PLC',
    arOutstanding: '£186,400.00',
    postedJournalsCount: '614',
    quoteTotal: '£44,400.00',
    lines: [
      {
        sku: 'LIC-ENT-24',
        description: 'Annual Platform Licence (25 Seats)',
        qty: '1.00',
        unitPrice: '28,000.00',
        lineTotal: '28,000.00',
      },
      {
        sku: 'SLA-24X7-01',
        description: 'Dedicated Support Entitlement (12m)',
        qty: '1.00',
        unitPrice: '9,000.00',
        lineTotal: '9,000.00',
      },
      {
        sku: 'TAX-UK-20',
        description: 'UK Standard VAT @ 20.0%',
        qty: '1.00',
        unitPrice: '7,400.00',
        lineTotal: '7,400.00',
      },
    ],
    journalLines: [
      {
        accountCode: '1100',
        accountName: 'Accounts Receivable — Trade',
        debitBase: '44400.00',
        creditBase: '0.00',
        partyRef: 'PTY-0219',
      },
      {
        accountCode: '4100',
        accountName: 'Deferred Subscription Revenue',
        debitBase: '0.00',
        creditBase: '28000.00',
      },
      {
        accountCode: '4120',
        accountName: 'Support Entitlement Revenue',
        debitBase: '0.00',
        creditBase: '9000.00',
      },
      {
        accountCode: '2140',
        accountName: 'VAT Output Control',
        debitBase: '0.00',
        creditBase: '7400.00',
      },
    ],
    partialPaymentAmount: '24,400.00',
    remainingAfterPayment: '20,000.00',
  },
];

export interface JourneyDefinition {
  id: string;
  title: string;
  phase: ReleasePhase;
  description: string;
  stages: WorkflowStage[];
}

export const ENTERPRISE_JOURNEYS: JourneyDefinition[] = [
  {
    id: 'lead-to-cash',
    title: 'Lead-to-Cash',
    phase: 'Phase 1',
    description:
      'Every sale flows smoothly from initial inquiry through approved quotes, confirmed orders, numbered invoices, and balanced financial reports—without re-typing data.',
    stages: [
      {
        id: 'lead',
        label: 'Lead',
        statusLabel: 'Qualified & Matched',
        summary:
          'Capture new inquiries with source tracking, assigned sales owners, and clean conversion into your central customer directory without creating duplicate profiles.',
        statusFlow: 'New → Contacted → Qualified → Converted',
        safeguard:
          'Prevents duplicate customer accounts while keeping the full original prospect history intact.',
        teamAction: 'Qualify prospect and convert into a verified customer record',
        automaticResult: 'Creates a unified customer profile and opens a tracked sales opportunity',
      },
      {
        id: 'quote',
        label: 'Quote',
        statusLabel: 'Revision Approved',
        summary:
          'Prepare branded quotations that lock item descriptions, unit prices, discounts, tax rates, and expiry dates once approved—with manager sign-off for high-value discounts.',
        statusFlow: 'Draft → Submitted → Approved → Sent → Accepted',
        safeguard:
          'Approved quotes stay locked; any price adjustment automatically creates a new numbered revision.',
        teamAction: 'Submit quote for manager approval and send branded PDF to client',
        automaticResult: 'Locks agreed pricing and tax terms so catalogue updates never alter the deal',
      },
      {
        id: 'order',
        label: 'Order',
        statusLabel: 'Confirmed Commitment',
        summary:
          'Accepted quotes turn into confirmed sales orders in one click, linking every product, service, or subscription item directly to delivery, projects, or billing.',
        statusFlow: 'Draft → Confirmed → Fulfilling → Fulfilled',
        safeguard:
          'Once billed or delivered, an order cannot be silently cancelled without an approved reversal.',
        teamAction: 'Confirm customer acceptance and release order to fulfilment',
        automaticResult: 'Reserves delivery scope and prepares accurate invoice lines automatically',
      },
      {
        id: 'invoice',
        label: 'Invoice',
        statusLabel: 'Issued & Numbered',
        summary:
          'Automatic sequential invoice numbering per company and financial year. Issued invoices preserve exact tax and currency rates and cannot be altered or deleted.',
        statusFlow: 'Draft → Issued → Part Paid → Paid',
        safeguard:
          'Every order-based invoice links back to its sales order; reductions require an official credit note.',
        teamAction: 'Review line items and issue official customer invoice',
        automaticResult: 'Updates customer receivables and sends a clean branded invoice copy',
      },
      {
        id: 'payment',
        label: 'Payment',
        statusLabel: 'Matched & Verified',
        summary:
          'Record bank transfers or card receipts and apply them cleanly across a single invoice or split them across multiple open customer balances.',
        statusFlow: 'Received → Verified → Allocated → Reconciled',
        safeguard:
          'Blocks over-allocation so a payment can never exceed its received amount or an invoice balance.',
        teamAction: 'Record incoming receipt and match it to one or more open invoices',
        automaticResult: 'Updates remaining customer balances and ageing reports immediately',
      },
      {
        id: 'ledger',
        label: 'Ledger',
        statusLabel: 'Books Balanced',
        summary:
          'Balanced double-entry journals post directly to your company Chart of Accounts, instantly updating your Trial Balance, Profit & Loss, and Balance Sheet.',
        statusFlow: 'Draft → Pending Approval → Posted → Reversed',
        safeguard:
          'Debits must equal credits in an open accounting period; posted entries are locked for audit integrity.',
        teamAction: 'Approve and post financial entry into the company books',
        automaticResult: 'Refreshes live Trial Balance, P&L, and Balance Sheet reports in real time',
        isTerminalLedger: true,
      },
    ],
  },
  {
    id: 'procure-to-pay',
    title: 'Procure-to-Pay',
    phase: 'Phase 2',
    description:
      'Control company spending from internal purchase requests through approved supplier orders, warehouse receiving, bill verification, and accounts payable.',
    stages: [
      {
        id: 'requisition',
        label: 'Requisition',
        statusLabel: 'Department Approved',
        summary:
          'Capture internal purchase requests with needed-by dates, department budgets, and estimated costs before committing money to a supplier.',
        statusFlow: 'Draft → Submitted → Approved → Converted',
        safeguard:
          'Staff cannot approve their own purchase requests once spend exceeds department limits.',
        teamAction: 'Submit department purchase request for budget approval',
        automaticResult: 'Routes approval alert to department head and queues supplier ordering',
      },
      {
        id: 'po',
        label: 'Purchase Order',
        statusLabel: 'Issued to Supplier',
        summary:
          'Generate official supplier purchase orders linked to your central vendor directory with controlled quantities, agreed unit prices, and delivery terms.',
        statusFlow: 'Draft → Submitted → Approved → Sent → Part Received',
        safeguard:
          'Prevents receiving more items than ordered unless a manager approves the variance.',
        teamAction: 'Approve supplier terms and issue Purchase Order',
        automaticResult: 'Tracks expected deliveries and locks agreed pricing for bill checking',
      },
      {
        id: 'receipt',
        label: 'Goods Receipt',
        statusLabel: 'Warehouse Checked',
        summary:
          'Log physical deliveries as they arrive, capturing accepted versus damaged quantities, serial numbers, and supplier delivery discrepancies.',
        statusFlow: 'Received → Inspected → Accepted',
        safeguard:
          'Every accepted delivery updates stock levels exactly once with a permanent warehouse trail.',
        teamAction: 'Inspect incoming shipment and confirm accepted quantities',
        automaticResult: 'Adds verified items into warehouse stock and notifies accounts payable',
      },
      {
        id: 'stock',
        label: 'Stock Ledger',
        statusLabel: 'Live Inventory Balance',
        summary:
          'Always-accurate inventory balances calculated from every receipt, sale, and transfer—with automatic stock reservations for confirmed customer orders.',
        statusFlow: 'Reserved → Committed → Transferred',
        safeguard:
          'Blocks overselling or negative stock balances so teams never promise items they do not have.',
        teamAction: 'Reserve warehouse stock for active orders or transfer between locations',
        automaticResult: 'Updates real-time available stock across all warehouses and branches',
      },
      {
        id: 'bill',
        label: 'Supplier Bill',
        statusLabel: '3-Way Verified',
        summary:
          'Automatically check supplier bills against the original Purchase Order and warehouse delivery receipt before approving payment.',
        statusFlow: 'Draft → Matched → Approved → Paid',
        safeguard:
          'Requires dual sign-off on high-value vendor payouts and logs any bank detail changes.',
        teamAction: 'Verify supplier bill against PO and delivery receipt for payment',
        automaticResult: 'Schedules approved payable and flags any price or quantity mismatch',
      },
      {
        id: 'ap-ledger',
        label: 'Payables Books',
        statusLabel: 'Reconciled to Books',
        summary:
          'Outgoing supplier payments match directly to approved bills and post balanced payables, inventory, and expense entries into your company ledger.',
        statusFlow: 'Pending Approval → Posted',
        safeguard:
          'Supplier ageing statements always tie directly back to posted general ledger totals.',
        teamAction: 'Release supplier payout and finalize accounting entry',
        automaticResult: 'Updates cash balances, supplier statements, and expense reports automatically',
        isTerminalLedger: true,
      },
    ],
  },
  {
    id: 'contract-to-renewal',
    title: 'Contract-to-Renewal',
    phase: 'Phase 2',
    description:
      'Turn confirmed orders into active client agreements, software licences, service-level commitments, recurring billing schedules, and timely renewals.',
    stages: [
      {
        id: 'agreement',
        label: 'Agreement',
        statusLabel: 'Active Term',
        summary:
          'Centralize signed customer agreements straight from won sales orders—tracking contract start and end dates, covered services, and recurring values.',
        statusFlow: 'Draft → Approved → Active → Expired',
        safeguard:
          'Service coverage and support entitlements automatically stay bound to active contract dates.',
        teamAction: 'Activate signed client agreement from confirmed order',
        automaticResult: 'Establishes billing schedule, service terms, and renewal calendar',
      },
      {
        id: 'subscription',
        label: 'Subscription',
        statusLabel: 'Recurring Billing',
        summary:
          'Manage monthly or annual billing cycles, software licence seat counts, and upcoming expiry alerts without spreadsheet tracking.',
        statusFlow: 'Scheduled → Active → Renewal Due',
        safeguard:
          'Guarantees each billing cycle generates cleanly once with zero duplicate customer invoices.',
        teamAction: 'Confirm recurring seat counts and review upcoming billing batch',
        automaticResult: 'Prepares accurate recurring invoices on schedule every billing cycle',
      },
      {
        id: 'entitlement',
        label: 'Support & SLA',
        statusLabel: 'Coverage Verified',
        summary:
          'Link customer equipment and active contracts to business-hour response targets so support teams know immediately who is covered and what is urgent.',
        statusFlow: 'Verified → Active → Suspended',
        safeguard:
          'Every new support ticket checks active contract coverage automatically on creation.',
        teamAction: 'Open support ticket and track business-hour response timer',
        automaticResult: 'Alerts team leads before a response target is ever at risk of slipping',
      },
      {
        id: 'delivery',
        label: 'Projects & Time',
        statusLabel: 'Milestones Approved',
        summary:
          'Run client implementations with tasks, billable milestones, staff timesheets, and rechargeable expenses all connected to the customer contract.',
        statusFlow: 'Planned → Active → Completed',
        safeguard:
          'Billable hours and project expenses require manager approval before appearing on a client invoice.',
        teamAction: 'Approve completed project milestones, timesheets, and expenses',
        automaticResult: 'Feeds approved billable work directly into client invoicing',
      },
      {
        id: 'renewal',
        label: 'Renewal',
        statusLabel: 'Pipeline Opened',
        summary:
          'Automated renewal reminders notify account managers well ahead of contract expiry and open a fresh renewal opportunity in the sales pipeline.',
        statusFlow: 'Upcoming → Notified → Opportunity Opened',
        safeguard:
          'Ensures every expiring contract triggers one clear renewal workflow—never missed or duplicated.',
        teamAction: 'Engage client early with updated renewal quote and seat review',
        automaticResult: 'Keeps recurring revenue visible in forecasts months before expiry',
      },
      {
        id: 'margin-ledger',
        label: 'Profit & Margin',
        statusLabel: 'Live Deal Margin',
        summary:
          'Compare recurring and project revenue against actual staff time, expenses, and vendor licence costs—straight from your posted financial books.',
        statusFlow: 'Posted → Reconciled',
        safeguard:
          'Every margin report states exact currency, company scope, and reporting period.',
        teamAction: 'Review profitability across contracts, projects, and customers',
        automaticResult: 'Gives leadership real-time visibility into true delivery margins',
        isTerminalLedger: true,
      },
    ],
  },
];

export interface ErpModuleItem {
  id: string;
  name: string;
  category: string;
  phase: ReleasePhase;
  summary: string;
  manages: string;
  connectsWith: string;
  includedTools: string[];
  keyWorkflows: string[];
}

export const ERP_MODULES: ErpModuleItem[] = [
  {
    id: 'core',
    name: 'Companies, Access & Contacts',
    category: 'Foundation',
    phase: 'Phase 1',
    summary:
      'Manage multiple companies and branches under one roof with role-based staff permissions, a clean shared customer and supplier directory, automatic document numbering, and full activity history.',
    manages:
      'Company workspaces, branches, staff roles & access rules, shared customer/supplier directory, document numbering, and permanent audit trails',
    connectsWith: 'Every sales, operations, and accounting record across the platform',
    includedTools: [
      'Multi-Company & Branch Setup',
      'Staff Roles & Access Controls',
      'Shared Customer & Supplier Directory',
      'Automatic Document Numbering',
      'Permanent Activity & Audit History',
      'Company Currency & Fiscal Settings',
    ],
    keyWorkflows: [
      'Switch seamlessly between authorized company books',
      'Keep one clean record per customer or supplier',
      'Restrict sensitive data by role, company, or branch',
      'Inspect a full timeline of every client interaction',
    ],
  },
  {
    id: 'finance',
    name: 'Accounting & General Ledger',
    category: 'Finance',
    phase: 'Phase 1',
    summary:
      'Full double-entry accounting with company-specific Charts of Accounts, locked accounting periods, customer invoicing, supplier bills, payment matching, multi-currency rates, and live financial statements.',
    manages:
      'Chart of Accounts, journal entries, customer invoices, supplier bills, payment matching, tax rates, exchange rates, and financial statements',
    connectsWith: 'Sales orders, project billing milestones, and approved purchasing bills',
    includedTools: [
      'Company Chart of Accounts',
      'Double-Entry Journal Posting',
      'Numbered Customer Invoices & Credit Notes',
      'Payment Matching & Receivables Ageing',
      'Accounting Period Locks',
      'Live Trial Balance, P&L & Balance Sheet',
    ],
    keyWorkflows: [
      'Issue numbered invoices directly from confirmed orders',
      'Match partial or lump-sum payments across open invoices',
      'Post automatically balanced journal entries',
      'Generate audit-ready Trial Balance & P&L statements',
    ],
  },
  {
    id: 'sales',
    name: 'Quotes & Sales Orders',
    category: 'Commercial',
    phase: 'Phase 1',
    summary:
      'Create versioned customer quotes with locked pricing and tax terms, route high-value discounts for manager sign-off, and convert accepted quotes into tracked sales orders in one click.',
    manages:
      'Quote revisions, approved pricing & tax snapshots, confirmed sales orders, order line items, and delivery progress',
    connectsWith: 'Customer profiles, product catalogue, approval workflows, and finance invoicing',
    includedTools: [
      'Versioned Customer Quotations',
      'Discount & Margin Approval Gates',
      'Branded PDF Quote Export',
      'One-Click Sales Order Conversion',
      'Order Fulfilment & Billing Tracker',
    ],
    keyWorkflows: [
      'Build multi-line quotes with locked prices and tax rates',
      'Route quotes above threshold for manager sign-off',
      'Convert accepted quotes into confirmed sales orders',
      'Track delivery and invoicing status per order line',
    ],
  },
  {
    id: 'crm',
    name: 'CRM & Sales Pipeline',
    category: 'Sales',
    phase: 'Phase 1',
    summary:
      'Capture inbound leads, prevent duplicate contacts, guide deals through customizable pipeline stages, track calls and follow-ups, and forecast upcoming revenue by rep or team.',
    manages:
      'Incoming leads, sales pipeline stages, active opportunities, deal estimates, win/loss reasons, and team follow-up activities',
    connectsWith: 'Central customer directory, product catalogue, and customer quotations',
    includedTools: [
      'Lead Capture & Qualification',
      'Duplicate Contact Prevention',
      'Visual Deal Pipeline & Stages',
      'Activity & Follow-Up Log',
      'Weighted Sales Forecast Reports',
    ],
    keyWorkflows: [
      'Qualify new inquiries and assign sales owners',
      'Convert won leads cleanly into customer accounts',
      'Track deal stages and expected closing dates',
      'Forecast revenue by sales owner, branch, or company',
    ],
  },
  {
    id: 'catalog',
    name: 'Products, Services & Pricing',
    category: 'Catalogue',
    phase: 'Phase 1',
    summary:
      'Organize physical products, consulting services, software licences, and bundled packages in one structured catalogue with customer-specific price lists and effective-dated rates.',
    manages:
      'Product & service categories, item codes, units of measure, seasonal or customer price lists, and bundled package breakdowns',
    connectsWith: 'Quotations, sales orders, purchase orders, and warehouse inventory',
    includedTools: [
      'Products, Services & Licences Catalogue',
      'Item Categories & Units of Measure',
      'Customer & Segment Price Lists',
      'Time-Bounded Promotional Pricing',
      'Multi-Item Package & Bundle Pricing',
    ],
    keyWorkflows: [
      'Maintain one accurate item list for sales and purchasing',
      'Set region- or tier-specific pricing per currency',
      'Bundle hardware, licences, and setup services cleanly',
      'Update prices without breaking historical quotes',
    ],
  },
  {
    id: 'workflow',
    name: 'Approvals & Document Vault',
    category: 'Governance',
    phase: 'Phase 1',
    summary:
      'Automate multi-step sign-offs with built-in separation of duties so staff cannot approve their own transactions, paired with real-time alerts and encrypted storage for contracts and receipts.',
    manages:
      'Approval rules and chains, manager approval inbox, email/in-app alerts, branded PDF templates, and secure document storage',
    connectsWith: 'Quotes, purchase orders, supplier payouts, journals, and customer contracts',
    includedTools: [
      'Threshold-Based Approval Rules',
      'Central Manager Approval Inbox',
      'Dual Sign-Off & Anti-Self-Approval',
      'Encrypted Contract & Receipt Vault',
      'Branded Invoice & Quote Templates',
    ],
    keyWorkflows: [
      'Approve pending quotes, POs, and bills from one inbox',
      'Prevent initiators from approving their own spend',
      'Attach signed contracts and supplier receipts securely',
      'Send automatic alerts when approvals are needed',
    ],
  },
  {
    id: 'procurement',
    name: 'Purchasing & Suppliers',
    category: 'Operations',
    phase: 'Phase 2',
    summary:
      'Streamline internal purchase requests, multi-level Purchase Order approvals, partial warehouse receiving, discrepancy logging, and 3-way supplier bill verification.',
    manages:
      'Internal purchase requisitions, supplier Purchase Orders, delivery receipts, quantity checks, and vendor bill verification',
    connectsWith: 'Supplier directory, warehouse stock levels, and accounts payable',
    includedTools: [
      'Department Purchase Requisitions',
      'Approved Supplier Purchase Orders',
      'Partial Delivery & Goods Receiving',
      'Quantity & Damage Discrepancy Log',
      '3-Way PO, Receipt & Bill Matching',
    ],
    keyWorkflows: [
      'Request department purchases with budget visibility',
      'Issue approved Purchase Orders to vendors',
      'Verify physical deliveries before paying supplier bills',
      'Catch over-billing or short deliveries automatically',
    ],
  },
  {
    id: 'inventory',
    name: 'Inventory & Warehousing',
    category: 'Operations',
    phase: 'Phase 2',
    summary:
      'Track stock across multiple warehouses and storage locations with complete movement history, serial number tracking, automatic order reservations, and audited stock counts.',
    manages:
      'Warehouses, storage bins, inbound/outbound stock movements, serial numbers, customer order reservations, and stock takes',
    connectsWith: 'Product catalogue, sales order fulfilment, and supplier goods receipts',
    includedTools: [
      'Multi-Warehouse & Location Tracking',
      'Full Stock Movement History',
      'Serial Number Traceability',
      'Automatic Order Stock Reservations',
      'Audited Physical Stock Counts',
    ],
    keyWorkflows: [
      'See real-time available vs. reserved stock across sites',
      'Reserve stock automatically when an order is confirmed',
      'Trace serialized hardware from receipt to client delivery',
      'Reconcile physical stock takes with full approval logs',
    ],
  },
  {
    id: 'contracts',
    name: 'Contracts, Licences & Renewals',
    category: 'Recurring Revenue',
    phase: 'Phase 2',
    summary:
      'Manage master client agreements, software licence seats, automated recurring billing schedules, active service entitlements, and proactive renewal pipelines.',
    manages:
      'Client agreements, recurring subscriptions, software licence counts, renewal reminders, and service coverage entitlements',
    connectsWith: 'Confirmed sales orders, client delivery projects, support desk, and recurring invoices',
    includedTools: [
      'Master Customer Agreements',
      'Recurring Billing Schedules',
      'Software Licence & Seat Tracking',
      'Service Coverage & Entitlements',
      'Proactive Renewal Pipeline Alerts',
    ],
    keyWorkflows: [
      'Activate customer contracts straight from won orders',
      'Generate recurring monthly or annual invoices accurately',
      'Track software licence seats and upcoming expiries',
      'Open renewal deals automatically before contract end',
    ],
  },
  {
    id: 'projects',
    name: 'Projects & Billable Delivery',
    category: 'Delivery',
    phase: 'Phase 2',
    summary:
      'Plan client implementations with tasks, team assignments, milestone billing triggers, manager-approved timesheets, chargeable expenses, and live project profitability.',
    manages:
      'Client projects, team allocations, delivery milestones, task lists, billable timesheets, and rechargeable project expenses',
    connectsWith: 'Customer contracts, staff records, and customer milestone invoicing',
    includedTools: [
      'Project Workspaces & Task Lists',
      'Milestone Billing Triggers',
      'Approval-Gated Staff Timesheets',
      'Chargeable Project Expense Claims',
      'Real-Time Project Margin Tracking',
    ],
    keyWorkflows: [
      'Launch delivery projects directly from signed orders',
      'Approve staff billable hours and project expenses',
      'Trigger customer invoices as milestones are completed',
      'Compare actual delivery cost against contracted value',
    ],
  },
  {
    id: 'support',
    name: 'Customer Support & SLAs',
    category: 'Service Desk',
    phase: 'Phase 2',
    summary:
      'Deliver contract-verified customer support linked to installed client equipment, with business-hour response clocks, private internal team notes, and escalation alerts.',
    manages:
      'Client equipment register, service-level calendars, support queues, tickets, customer replies, internal notes, and escalation tracking',
    connectsWith: 'Customer profiles, active contract entitlements, and support team members',
    includedTools: [
      'Contract-Verified Support Tickets',
      'Installed Client Asset Register',
      'Business-Hour SLA Response Clocks',
      'Private Internal vs. Client Replies',
      'Automatic At-Risk Escalation Alerts',
    ],
    keyWorkflows: [
      'Verify active contract coverage when a ticket arrives',
      'Track response and resolution targets in business hours',
      'Collaborate internally without exposing notes to clients',
      'Escalate overdue issues automatically to team leads',
    ],
  },
  {
    id: 'expansion',
    name: 'HR, Payroll, Assets & Portals',
    category: 'Expansion',
    phase: 'Phase 3',
    summary:
      'Add confidential employee records, leave and attendance tracking, approved payroll runs, fixed asset depreciation, bank feeds, and self-service customer and supplier portals.',
    manages:
      'Employee profiles, leave & attendance, approved payroll runs, fixed assets & depreciation, bank connections, and external portals',
    connectsWith: 'Company accounting books, executive reporting, and customer/supplier directories',
    includedTools: [
      'Confidential Employee & Leave Records',
      'Approved Payroll Runs & Payslips',
      'Fixed Asset Register & Depreciation',
      'Bank Feed Reconciliation',
      'Customer & Supplier Self-Service Portals',
    ],
    keyWorkflows: [
      'Keep HR and payroll records strictly restricted to HR/Finance',
      'Post approved payroll and depreciation straight to the books',
      'Let customers view invoices and support tickets online',
      'Give executives cross-company performance dashboards',
    ],
  },
];

export interface TrustPillarCard {
  title: string;
  badge: string;
  summary: string;
  highlights: string[];
}

export const TRUST_SHOWCASE_TABS: Record<
  'financial' | 'entities' | 'approvals' | 'privacy',
  {
    headerLeft: string;
    headerRight: string;
    cards: TrustPillarCard[];
  }
> = {
  financial: {
    headerLeft: 'Automatic Accounting Protection',
    headerRight: 'Always Audit-Ready',
    cards: [
      {
        title: 'Guaranteed Balanced Books',
        badge: 'Zero Imbalance',
        summary:
          'Every journal entry is checked automatically before posting—debits and credits must match to the exact cent, preventing broken reports.',
        highlights: [
          'Exact decimal calculations with zero rounding drift',
          'Instant updates to Trial Balance, P&L, and Balance Sheet',
        ],
      },
      {
        title: 'Closed-Period Protection',
        badge: 'Period Lock',
        summary:
          'Once a financial month or year is closed, no one can silently backdate or alter past figures without formal reopening approval.',
        highlights: [
          'Prevents accidental changes to audited prior months',
          'Corrections use transparent reversing entries or credit notes',
        ],
      },
      {
        title: 'Locked Commercial History',
        badge: 'Immutable Trail',
        summary:
          'Approved quotes and issued invoices keep the exact prices, tax rates, and exchange rates agreed on that day—even if your catalogue changes later.',
        highlights: [
          'Sequential numbering per company and financial year',
          'Full traceability from original quote to final cash receipt',
        ],
      },
      {
        title: 'Every Action Recorded',
        badge: 'Full Audit Log',
        summary:
          'Every approval, price edit, payment match, and accounting posting records who did it, when it happened, and what changed.',
        highlights: [
          'Tamper-evident history ready for external auditors',
          'Eliminates spreadsheet version confusion at month-end',
        ],
      },
    ],
  },
  entities: {
    headerLeft: 'Multi-Company & Multi-Currency Group Control',
    headerRight: 'Strict Data Boundaries',
    cards: [
      {
        title: 'Separate Books Per Company',
        badge: 'Independent Ledger',
        summary:
          'Run multiple subsidiaries—such as a Nigerian operating company (NGN) and a UK entity (GBP)—from one workspace without mixing books.',
        highlights: [
          'Dedicated Chart of Accounts, tax codes, and bank accounts',
          'Independent invoice numbering and fiscal calendars',
        ],
      },
      {
        title: 'Scoped Staff Visibility',
        badge: 'Zero Leakage',
        summary:
          'Staff only see the companies, branches, and accounts they are explicitly assigned to—keeping subsidiary data cleanly separated.',
        highlights: [
          'Entity switcher shows only authorized workspaces',
          'Exports and reports respect exact user permissions',
        ],
      },
      {
        title: 'Multi-Currency Confidence',
        badge: 'FX Rate History',
        summary:
          'Quote, invoice, and pay suppliers in local or foreign currencies while preserving the exact exchange rate applied on each transaction.',
        highlights: [
          'Clear currency symbols and amounts on every document',
          'Consistent home-currency financial statements per entity',
        ],
      },
      {
        title: 'Shared Directory, Clean Governance',
        badge: 'No Duplicates',
        summary:
          'Maintain one trusted master record for customers and suppliers across your organization while tracking balances separately per company.',
        highlights: [
          'Instant 360° view of client history and open balances',
          'Prevents duplicate supplier profiles and payment mistakes',
        ],
      },
    ],
  },
  approvals: {
    headerLeft: 'Built-In Separation of Duties',
    headerRight: 'Role-Based Controls',
    cards: [
      {
        title: 'No Self-Approval on Spend or Discounts',
        badge: 'Dual Sign-Off',
        summary:
          'The person who creates a high-value quote, Purchase Order, supplier payout, or manual journal can never be the one to approve it.',
        highlights: [
          'Configurable approval limits by amount or department',
          'Clear escalation path when managers are away',
        ],
      },
      {
        title: 'IT Admins Cannot Peek at Payroll',
        badge: 'Least Privilege',
        summary:
          'System setup administrators do not automatically gain access to confidential employee salaries, bank details, or financial approvals.',
        highlights: [
          'Strict separation between technical setup and finance/HR',
          'Sensitive bank and payroll fields masked by default',
        ],
      },
      {
        title: 'Protected Customer & Internal Notes',
        badge: 'Scoped Access',
        summary:
          'Support teams can discuss tickets privately without ever exposing internal remarks to customers or external portal users.',
        highlights: [
          'Clear visual distinction between internal and external notes',
          'External users see only their own orders, bills, and tickets',
        ],
      },
      {
        title: 'Two-Step Verification for Key Roles',
        badge: 'MFA Protected',
        summary:
          'Finance controllers, approvers, and workspace administrators are protected with mandatory multi-factor sign-in.',
        highlights: [
          'Protects high-value approvals from unauthorized sign-ins',
          'Instant session revocation when staff change roles',
        ],
      },
    ],
  },
  privacy: {
    headerLeft: 'Enterprise Data Privacy & Continuity',
    headerRight: 'NDPA Ready',
    cards: [
      {
        title: 'Strict Company Data Isolation',
        badge: 'Verified Boundaries',
        summary:
          'Your organization workspace is completely isolated from every other customer, with automated checks continuously verifying access boundaries.',
        highlights: [
          'Company context verified on every action and export',
          'Zero cross-company data mixing by design',
        ],
      },
      {
        title: 'Encrypted Private File Storage',
        badge: 'Protected Files',
        summary:
          'Signed contracts, customer invoices, and supplier receipts are encrypted at rest and shared only through secure, time-limited links.',
        highlights: [
          'No publicly exposed document links',
          'Complete download and attachment history',
        ],
      },
      {
        title: 'Continuous Automated Backups',
        badge: '≤ 15 Min RPO',
        summary:
          'Your financial and operational records are backed up continuously and tested regularly so your business stays protected against data loss.',
        highlights: [
          'Point-in-time recovery within minutes of an incident',
          'Monthly staged recovery drills for peace of mind',
        ],
      },
      {
        title: 'NDPA Privacy & Compliance Ready',
        badge: 'Governance',
        summary:
          'Built from day one to support Nigerian Data Protection Act (NDPA) readiness, data minimization, and clean external audit reviews.',
        highlights: [
          'Masked sensitive identifiers for payroll and banking',
          'Transparent audit logs across every business module',
        ],
      },
    ],
  },
};

export interface MilestoneItem {
  id: string;
  stepNumber: string;
  title: string;
  phase: ReleasePhase;
  deliverables: string[];
  reviewEvidence: string;
  exitGate: string;
}

export const ROADMAP_MILESTONES: MilestoneItem[] = [
  {
    id: 'm0',
    stepNumber: '01',
    title: 'Workspace Setup & Access Security',
    phase: 'Phase 1',
    deliverables: [
      'Secure team sign-in with two-step verification for workspace admins and finance approvers',
      'Multi-company workspace structure keeping each legal entity’s books and staff access cleanly separated',
      'Central customer and supplier directory, automatic document numbering, and permanent activity history',
    ],
    reviewEvidence:
      'Workspace admin signs in, switches between authorized company workspaces, and verifies that unauthorized teams cannot view restricted subsidiary records.',
    exitGate: 'All company privacy checks verified alongside automated daily backup & restore tests.',
  },
  {
    id: 'm1',
    stepNumber: '02',
    title: 'Sales Pipeline, Quotes & Orders',
    phase: 'Phase 1',
    deliverables: [
      'Unified product, service, licence, and package catalogue with flexible customer price lists',
      'Lead tracking, sales pipeline stages, and team follow-up history without duplicate contacts',
      'Versioned customer quotes with locked pricing, manager discount approvals, and branded PDF export',
    ],
    reviewEvidence:
      'An accepted multi-line quote converts cleanly into a confirmed sales order while keeping exact agreed prices even after catalogue rates change.',
    exitGate: 'Quote locking and manager approval controls signed off by sales and finance leads.',
  },
  {
    id: 'm2',
    stepNumber: '03',
    title: 'Core Accounting & Phase 1 Go-Live',
    phase: 'Phase 1',
    deliverables: [
      'Numbered customer invoices, partial or multi-invoice payment matching, and supplier bill entry',
      'Automated double-entry accounting engine with accounting period locks to protect closed months',
      'Live company Trial Balance, General Ledger, Profit & Loss, Balance Sheet, and ageing statements',
    ],
    reviewEvidence:
      'A complete customer deal—from first inquiry through paid invoice—ties out to the exact cent across Trial Balance and financial reports.',
    exitGate: 'Zero unbalanced entries, closed-period lock verified, and finance leadership sign-off.',
  },
  {
    id: 'm3',
    stepNumber: '04',
    title: 'Purchasing, Warehousing & Stock',
    phase: 'Phase 2',
    deliverables: [
      'Internal purchase requests, approved supplier Purchase Orders, and partial warehouse receiving',
      'Live inventory movement history, serial number tracking, and automatic stock reservations',
      'Automated 3-way checking across Purchase Orders, goods receipts, and supplier bills',
    ],
    reviewEvidence:
      'A partial warehouse delivery updates available stock accurately once while blocking accidental overselling across simultaneous orders.',
    exitGate: 'Stock accuracy checks and supplier bill-matching tolerances verified in live walk-throughs.',
  },
  {
    id: 'm4',
    stepNumber: '05',
    title: 'Contracts, Projects & Customer Support',
    phase: 'Phase 2',
    deliverables: [
      'Master customer agreements, software licence seat tracking, and automated recurring billing',
      'Client delivery projects, task tracking, milestone invoicing, and approved billable timesheets',
      'Contract-verified customer support desk with business-hour SLA clocks and private team notes',
    ],
    reviewEvidence:
      'Live project profitability report, active SLA response timer, and automated renewal reminder run cleanly with zero duplicate invoices.',
    exitGate: 'Recurring billing accuracy and private vs. client-visible note controls signed off.',
  },
  {
    id: 'm5',
    stepNumber: '06',
    title: 'HR, Payroll, Fixed Assets & Portals',
    phase: 'Phase 3',
    deliverables: [
      'Confidential employee records, leave & attendance tracking, and approved payroll runs posted to accounting',
      'Fixed asset register, automated depreciation schedules, bank feeds, and budget controls',
      'Self-service portals for customers and suppliers alongside executive performance dashboards',
    ],
    reviewEvidence:
      'Privacy review completed for payroll data alongside isolated portal testing for external customers and vendors.',
    exitGate: 'Role separation, data privacy readiness, and full leadership acceptance sign-off.',
  },
];

export interface VerticalSliceItem {
  sequence: number;
  outcome: string;
  exitGate: string;
  phase: ReleasePhase;
}

export const VERTICAL_SLICES: VerticalSliceItem[] = [
  {
    sequence: 1,
    outcome: 'Workspace setup, secure sign-in, multi-company boundaries, and automated backups',
    exitGate: 'Company isolation checks and recovery drills verified.',
    phase: 'Phase 1',
  },
  {
    sequence: 2,
    outcome: 'Shared customer/supplier directory, product catalogue, and CRM sales pipeline',
    exitGate: 'Zero duplicate contacts and clean team pipeline visibility.',
    phase: 'Phase 1',
  },
  {
    sequence: 3,
    outcome: 'Customer quote → manager approval → confirmed sales order with locked pricing',
    exitGate: 'Historical quote pricing and approval sign-offs verified.',
    phase: 'Phase 1',
  },
  {
    sequence: 4,
    outcome: 'Customer invoice → payment matching → balanced journal entries → financial reports',
    exitGate: 'Trial Balance reconciliation and closed-month lock verified.',
    phase: 'Phase 1',
  },
  {
    sequence: 5,
    outcome: 'Purchase request → supplier PO → warehouse receipt → live stock & bill verification',
    exitGate: '3-way bill matching and accurate stock balances confirmed.',
    phase: 'Phase 2',
  },
  {
    sequence: 6,
    outcome: 'Client agreement → project tasks & timesheets → milestone billing & renewals',
    exitGate: 'Recurring billing accuracy and real-time deal margin verified.',
    phase: 'Phase 2',
  },
  {
    sequence: 7,
    outcome: 'Contract coverage check → customer support ticket → business-hour SLA tracking',
    exitGate: 'Response timers and internal note privacy verified.',
    phase: 'Phase 2',
  },
  {
    sequence: 8,
    outcome: 'Confidential HR & payroll, fixed asset depreciation, executive analytics, and portals',
    exitGate: 'Data privacy review, role separation, and final sign-off.',
    phase: 'Phase 3',
  },
];

export const RELIABILITY_METRICS = [
  {
    id: 'rel-01',
    eyebrow: 'Platform Uptime',
    value: '99.5%+',
    detail: 'Continuously monitored availability',
  },
  {
    id: 'rel-02',
    eyebrow: 'Everyday Speed',
    value: '< 1.2s',
    detail: 'Built for 100+ concurrent staff',
  },
  {
    id: 'rel-03',
    eyebrow: 'Backup Window',
    value: '≤ 15 min',
    detail: 'Continuous automated backups',
  },
  {
    id: 'rel-04',
    eyebrow: 'Recovery Target',
    value: '≤ 4 hours',
    detail: 'Monthly staged restore drills',
  },
  {
    id: 'rel-05',
    eyebrow: 'Security Standard',
    value: 'Enterprise',
    detail: 'MFA, encryption & NDPA ready',
  },
  {
    id: 'rel-06',
    eyebrow: 'Entity Isolation',
    value: '100%',
    detail: 'Verified separation per company',
  },
];

export const FAQ_ITEMS: AccordionItemData[] = [
  {
    id: 'unified-platform',
    category: 'Platform',
    question: 'Why use one unified platform instead of connecting separate apps together?',
    answer:
      'When CRM, invoicing, inventory, and accounting live in disconnected tools, teams waste hours copying numbers, fixing sync errors, and reconciling mismatched totals at month-end. 3Metr runs your entire operation inside one cohesive system—so an approved quote, a warehouse shipment, and a customer payment automatically keep your financial books in sync.',
  },
  {
    id: 'multi-company',
    category: 'Security',
    question: 'Can we manage multiple companies and currencies under one account?',
    answer:
      'Yes. Your organization workspace can house multiple legal entities—such as a Nigerian subsidiary billing in NGN and a UK subsidiary billing in GBP. Each company keeps its own Chart of Accounts, tax rules, bank accounts, financial periods, and invoice numbering, while staff only see the companies they are authorized to access.',
  },
  {
    id: 'accounting-accuracy',
    category: 'Accounting',
    question: 'How does 3Metr keep our financial books accurate and audit-ready?',
    answer:
      'Every accounting entry is automatically verified so total debits always equal total credits in an open financial period, using exact decimal precision with no rounding errors. Once an invoice is issued or a journal is posted, it cannot be quietly edited or deleted—corrections always leave a clean trail through official credit notes or reversing entries.',
  },
  {
    id: 'separation-of-duties',
    category: 'Security',
    question: 'Can staff or system administrators approve their own expenses or view payroll?',
    answer:
      'No. 3Metr enforces role-based access with built-in separation of duties. Staff cannot approve their own high-value quotes, Purchase Orders, supplier payouts, or accounting entries, and technical workspace administrators never automatically inherit access to confidential HR or payroll records.',
  },
  {
    id: 'phased-rollout',
    category: 'Rollout',
    question: 'How do we roll out 3Metr without disrupting daily operations?',
    answer:
      '3Metr launches in practical, complete business stages rather than forcing everything live at once. Phase 1 gets your core sales, invoicing, and double-entry accounting running smoothly from end to end before Phase 2 layers in purchasing, inventory, contracts, projects, and customer support.',
  },
  {
    id: 'ideal-fit',
    category: 'Rollout',
    question: 'Which types of businesses is 3Metr designed for right now?',
    answer:
      '3Metr is purpose-built for growing technology companies, consulting firms, service providers, and multi-entity trading businesses that need tight commercial and financial control. Specialized factory manufacturing lines and retail storefront cash registers are outside the initial Phase 1 focus so core finance and operations stay fast and reliable.',
  },
];
