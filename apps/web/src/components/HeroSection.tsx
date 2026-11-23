import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileCheck2,
  Lock,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { validateJournalEntry, type JournalLineInput } from '@metr/contracts';
import { Button } from '@metr/ui';
import { LEGAL_ENTITY_DEMOS } from '../data/metrContent';

type PreviewTab = 'document' | 'ledger';

const MINI_CHAIN = [
  { key: 'lead', label: 'Lead' },
  { key: 'quote', label: 'Quote' },
  { key: 'order', label: 'Order' },
  { key: 'invoice', label: 'Invoice' },
  { key: 'payment', label: 'Payment' },
  { key: 'ledger', label: 'Ledger' },
] as const;

export function HeroSection() {
  const [entityIndex, setEntityIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<PreviewTab>('ledger');
  const [paymentAllocated, setPaymentAllocated] = useState(false);
  const [simulateImbalance, setSimulateImbalance] = useState(false);

  const entity = LEGAL_ENTITY_DEMOS[entityIndex];

  const activeJournalLines: JournalLineInput[] = useMemo(() => {
    const base = entity.journalLines.map((line) => ({ ...line }));
    if (simulateImbalance && base.length > 0) {
      // Simulate UAT-04: intentionally alter first debit line by 100.00 to demonstrate atomic guard
      const firstDebit = Number(base[0].debitBase);
      base[0] = {
        ...base[0],
        debitBase: (firstDebit - 100).toFixed(2),
      };
    }
    return base;
  }, [entity, simulateImbalance]);

  const journalCheck = useMemo(
    () => validateJournalEntry(activeJournalLines, entity.periodStatus),
    [activeJournalLines, entity.periodStatus]
  );

  const handleEntitySwitch = (idx: number) => {
    setEntityIndex(idx);
    setPaymentAllocated(false);
    setSimulateImbalance(false);
  };

  return (
    <section
      id="top"
      className="relative bg-[#F5F7FA] border-b border-[#E5EBF0] overflow-x-clip"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 pt-12 pb-16 lg:pt-16 lg:pb-24">
        {/* 12-Column Fluid Grid: 5:7 split on desktop per Precision Ledger & Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-stretch">
          {/* Left 5 Columns: Authoritative Text Framing */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-center gap-6 pr-0 lg:pr-4"
          >
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#0F766E]">
              <span>Multi-Entity ERP Platform</span>
            </div>

            <h1 className="font-[Manrope] text-[36px] sm:text-[46px] lg:text-[52px] xl:text-[56px] font-extrabold leading-[1.12] tracking-[-0.03em] text-[#102A43]">
              One System of Record from Lead to Ledger.
            </h1>

            <p className="text-[16px] sm:text-[18px] leading-[28px] text-[#3E4947] max-w-[50ch]">
              Replace fragmented spreadsheets, disconnected invoicing tools, and manual
              reconciliations with a unified operational and double-entry financial platform built
              for technology and professional-services enterprises.
            </p>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button asAnchor href="#waitlist" variant="primary" size="lg">
                Request Early Access
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
              <Button asAnchor href="#architecture" variant="secondary" size="lg">
                Security & Controls
              </Button>
            </div>

            {/* Quiet unboxed proof strip */}
            <div className="pt-5 mt-2 border-t border-[#E5EBF0] grid grid-cols-3 gap-2.5 sm:gap-4 font-tabular">
              <div className="min-w-0">
                <div className="font-[Manrope] text-[18px] sm:text-[20px] font-bold text-[#102A43] leading-tight">
                  12
                </div>
                <div className="text-[11px] sm:text-[12px] font-medium text-[#526579] mt-0.5">
                  Business Modules
                </div>
              </div>
              <div className="border-l border-[#E5EBF0] pl-2.5 sm:pl-4 min-w-0">
                <div className="font-[Manrope] text-[18px] sm:text-[20px] font-bold text-[#102A43] leading-tight">
                  Multi-Entity
                </div>
                <div className="text-[11px] sm:text-[12px] font-medium text-[#526579] mt-0.5">
                  Companies & Currencies
                </div>
              </div>
              <div className="border-l border-[#E5EBF0] pl-2.5 sm:pl-4 min-w-0">
                <div className="font-[Manrope] text-[18px] sm:text-[20px] font-bold text-[#0F766E] leading-tight whitespace-nowrap">
                  100%
                </div>
                <div className="text-[11px] sm:text-[12px] font-medium text-[#526579] mt-0.5">
                  Auto-Balanced Books
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right 7 Columns: Live Interactive 3Metr Workspace Preview */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col min-w-0"
          >
            <div
              className="metr-card rounded-[1.5rem] overflow-hidden flex flex-col h-full bg-white"
              aria-label="Interactive 3Metr multi-entity ledger preview"
            >
              {/* Workspace Top Chrome: Legal Entity Switcher & Fiscal Period */}
              <div className="bg-[#102A43] text-white px-4 sm:px-5 py-3.5 flex flex-wrap items-center justify-between gap-2.5 border-b border-[#172B4D]">
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="inline-flex items-center gap-2">
                    <Building2 size={16} className="text-[#2DD4BF] shrink-0" aria-hidden="true" />
                    <span className="text-[12px] font-semibold tracking-[0.02em] text-[#EDF0FF] whitespace-nowrap">
                      Company Workspace
                    </span>
                  </div>
                  <div
                    role="group"
                    aria-label="Switch legal entity"
                    className="inline-flex flex-wrap items-center rounded-[0.5rem] bg-[#0B1724] p-0.5 border border-white/10"
                  >
                    {LEGAL_ENTITY_DEMOS.map((demo, idx) => (
                      <button
                        key={demo.id}
                        type="button"
                        onClick={() => handleEntitySwitch(idx)}
                        aria-pressed={entityIndex === idx}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-[0.375rem] transition-colors whitespace-nowrap metr-focus ${
                          entityIndex === idx
                            ? 'bg-[#0F766E] text-white'
                            : 'text-[#B0C9E8] hover:text-white'
                        }`}
                      >
                        {demo.shortName}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] font-mono font-tabular text-[#B0C9E8]">
                  <span>{entity.fiscalPeriod}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#2DD4BF] font-semibold uppercase">Period Open</span>
                </div>
              </div>

              {/* Connected Movement Status Rail */}
              <div className="px-5 py-3.5 bg-[#F5F7FA] border-b border-[#E5EBF0] flex items-center justify-between gap-2 overflow-x-auto">
                <div className="flex items-center min-w-max">
                  {MINI_CHAIN.map((step, i) => {
                    const reached =
                      i <= (paymentAllocated ? 5 : activeTab === 'ledger' ? 5 : 3);
                    return (
                      <div key={step.key} className="flex items-center">
                        <span
                          className={`text-[11px] font-semibold tracking-[0.02em] whitespace-nowrap ${
                            reached ? 'text-[#0F766E]' : 'text-[#526579]'
                          }`}
                        >
                          {step.label}
                        </span>
                        {i < MINI_CHAIN.length - 1 && (
                          <span className="mx-2 flex items-center" aria-hidden="true">
                            <span
                              className={`h-[2px] w-4 sm:w-5 ${
                                reached ? 'bg-[#0F766E]' : 'bg-[#D7E0E8]'
                              }`}
                            />
                            <span
                              className={`h-1.5 w-1.5 rounded-full -ml-3 ${
                                reached ? 'bg-[#2DD4BF] ring-1 ring-[#0F766E]' : 'bg-[#D7E0E8]'
                              }`}
                            />
                            <span
                              className={`h-[2px] w-2 ${
                                reached ? 'bg-[#0F766E]' : 'bg-[#D7E0E8]'
                              }`}
                            />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <span className="text-[11px] font-mono font-tabular text-[#526579] whitespace-nowrap shrink-0">
                  {entity.invoiceNumber}
                </span>
              </div>

              {/* Workspace Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col gap-5">
                {/* Summary KPI Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-[0.75rem] border border-[#E5EBF0] bg-[#F5F7FA]/60 px-4 py-3">
                    <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#526579]">
                      Document Total
                    </div>
                    <div className="mt-1 font-[Manrope] font-tabular text-[20px] font-bold text-[#172B4D]">
                      {entity.quoteTotal}
                    </div>
                    <div className="text-[11px] font-medium text-[#526579] truncate">
                      {entity.customerParty}
                    </div>
                  </div>

                  <div className="rounded-[0.75rem] border border-[#E5EBF0] bg-[#F5F7FA]/60 px-4 py-3">
                    <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#526579]">
                      Invoice Status
                    </div>
                    <div className="mt-1 font-[Manrope] font-tabular text-[20px] font-bold text-[#0F766E]">
                      {paymentAllocated ? 'Part Paid' : 'Issued'}
                    </div>
                    <div className="text-[11px] font-medium font-tabular text-[#526579]">
                      {paymentAllocated
                        ? `Rem: ${entity.symbol}${entity.remainingAfterPayment}`
                        : `Order ${entity.orderNumber}`}
                    </div>
                  </div>

                  <div className="rounded-[0.75rem] border border-[#E5EBF0] bg-[#F5F7FA]/60 px-4 py-3">
                    <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#526579]">
                      Ledger Balance Δ
                    </div>
                    <div
                      className={`mt-1 font-[Manrope] font-tabular text-[20px] font-bold ${
                        journalCheck.valid ? 'text-[#102A43]' : 'text-[#BA1A1A]'
                      }`}
                    >
                      {journalCheck.valid ? `${entity.symbol}0.00` : `${entity.symbol}-100.00`}
                    </div>
                    <div className="text-[11px] font-medium font-tabular text-[#526579]">
                      {journalCheck.valid ? 'Double-Entry Verified' : 'Blocked — Out of Balance'}
                    </div>
                  </div>
                </div>

                {/* View Mode Switcher & Interactive Proof Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div
                    role="tablist"
                    aria-label="Workspace view tabs"
                    className="inline-flex items-center rounded-[0.5rem] bg-[#F5F7FA] p-1 border border-[#E5EBF0]"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'ledger'}
                      onClick={() => setActiveTab('ledger')}
                      className={`px-3 py-1.5 text-[12px] font-semibold rounded-[0.375rem] transition-colors whitespace-nowrap metr-focus ${
                        activeTab === 'ledger'
                          ? 'bg-white text-[#102A43] shadow-[0_1px_2px_rgba(16,42,69,0.08)]'
                          : 'text-[#526579] hover:text-[#172B4D]'
                      }`}
                    >
                      Double-Entry Journal
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'document'}
                      onClick={() => setActiveTab('document')}
                      className={`px-3 py-1.5 text-[12px] font-semibold rounded-[0.375rem] transition-colors whitespace-nowrap metr-focus ${
                        activeTab === 'document'
                          ? 'bg-white text-[#102A43] shadow-[0_1px_2px_rgba(16,42,69,0.08)]'
                          : 'text-[#526579] hover:text-[#172B4D]'
                      }`}
                    >
                      Quote & Invoice Lines
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentAllocated((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 rounded-[0.5rem] border border-[#D7E0E8] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-[#172B4D] hover:bg-[#F5F7FA] hover:border-[#0F766E]/40 transition-colors whitespace-nowrap metr-focus"
                    >
                      <FileCheck2 size={13} className="text-[#0F766E]" aria-hidden="true" />
                      {paymentAllocated ? 'Reset Payment' : 'Allocate Payment'}
                    </button>
                    {activeTab === 'ledger' && (
                      <button
                        type="button"
                        onClick={() => setSimulateImbalance((prev) => !prev)}
                        className={`inline-flex items-center gap-1.5 rounded-[0.5rem] border px-2.5 py-1.5 text-[12px] font-semibold transition-colors whitespace-nowrap metr-focus ${
                          simulateImbalance
                            ? 'border-[#BA1A1A]/30 bg-[#FFDAD6]/40 text-[#93000A]'
                            : 'border-[#D7E0E8] bg-white text-[#526579] hover:text-[#172B4D]'
                        }`}
                      >
                        {simulateImbalance ? (
                          <>
                            <RotateCcw size={13} aria-hidden="true" />
                            Restore Balance
                          </>
                        ) : (
                          <>
                            <ShieldAlert size={13} aria-hidden="true" />
                            Test Imbalance Guard
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Tabular Data Table */}
                <AnimatePresence mode="wait">
                  {activeTab === 'ledger' ? (
                    <motion.div
                      key={`ledger-${entity.id}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="rounded-[0.75rem] border border-[#D7E0E8] overflow-hidden"
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-[#F5F7FA] border-b border-[#D7E0E8] text-[11px] font-bold uppercase tracking-[0.06em] text-[#526579]">
                              <th className="py-2.5 px-3.5">GL Acct</th>
                              <th className="py-2.5 px-3.5">Account Name</th>
                              <th className="py-2.5 px-3.5 text-right">Debit ({entity.currency})</th>
                              <th className="py-2.5 px-3.5 text-right">Credit ({entity.currency})</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E5EBF0] text-[13px]">
                            {activeJournalLines.map((line, index) => (
                              <tr
                                key={`${line.accountCode}-${index}`}
                                className="hover:bg-[#F5F7FA]/60 transition-colors"
                              >
                                <td className="py-2.5 px-3.5 font-mono font-tabular font-medium text-[#102A43]">
                                  {line.accountCode}
                                </td>
                                <td className="py-2.5 px-3.5 text-[#172B4D] font-medium">
                                  {line.accountName}
                                </td>
                                <td className="py-2.5 px-3.5 text-right font-tabular text-[#172B4D]">
                                  {Number(line.debitBase) > 0
                                    ? `${entity.symbol}${Number(line.debitBase).toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}`
                                    : '—'}
                                </td>
                                <td className="py-2.5 px-3.5 text-right font-tabular text-[#172B4D]">
                                  {Number(line.creditBase) > 0
                                    ? `${entity.symbol}${Number(line.creditBase).toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}`
                                    : '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-[#F5F7FA] border-t border-[#D7E0E8] font-semibold text-[13px] font-tabular">
                              <td colSpan={2} className="py-2.5 px-3.5 text-[#102A43]">
                                Balanced Journal Total{' '}
                                <span className="font-mono text-[11px] font-medium text-[#526579] ml-1.5">
                                  ({entity.journalNumber})
                                </span>
                              </td>
                              <td className="py-2.5 px-3.5 text-right text-[#102A43]">
                                {entity.symbol}
                                {journalCheck.formattedDebit}
                              </td>
                              <td className="py-2.5 px-3.5 text-right text-[#102A43]">
                                {entity.symbol}
                                {journalCheck.formattedCredit}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {/* Invariant Banner */}
                      <div
                        className={`px-4 py-2.5 text-[12px] flex items-center justify-between gap-3 border-t ${
                          journalCheck.valid
                            ? 'bg-[#0F766E]/[0.06] border-[#0F766E]/15 text-[#005C55]'
                            : 'bg-[#FFDAD6]/60 border-[#BA1A1A]/25 text-[#93000A]'
                        }`}
                      >
                        <span className="inline-flex items-center gap-2 font-medium">
                          {journalCheck.valid ? (
                            <>
                              <CheckCircle2 size={14} className="shrink-0" aria-hidden="true" />
                              Debits equal credits · Permanently locked once posted
                            </>
                          ) : (
                            <>
                              <ShieldAlert size={14} className="shrink-0" aria-hidden="true" />
                              {journalCheck.errors[0]}
                            </>
                          )}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold whitespace-nowrap shrink-0">
                          <Lock size={11} aria-hidden="true" />
                          Auto-Balanced
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`doc-${entity.id}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="rounded-[0.75rem] border border-[#D7E0E8] overflow-hidden"
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-[#F5F7FA] border-b border-[#D7E0E8] text-[11px] font-bold uppercase tracking-[0.06em] text-[#526579]">
                              <th className="py-2.5 px-3.5">Item Code</th>
                              <th className="py-2.5 px-3.5">Description</th>
                              <th className="py-2.5 px-3.5 text-right">Qty</th>
                              <th className="py-2.5 px-3.5 text-right">Line Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E5EBF0] text-[13px]">
                            {entity.lines.map((line) => (
                              <tr key={line.sku} className="hover:bg-[#F5F7FA]/60">
                                <td className="py-2.5 px-3.5 font-mono text-[12px] text-[#526579]">
                                  {line.sku}
                                </td>
                                <td className="py-2.5 px-3.5 text-[#172B4D] font-medium">
                                  {line.description}
                                </td>
                                <td className="py-2.5 px-3.5 text-right font-tabular text-[#526579]">
                                  {line.qty}
                                </td>
                                <td className="py-2.5 px-3.5 text-right font-tabular font-medium text-[#172B4D]">
                                  {entity.symbol}
                                  {line.lineTotal}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-[#F5F7FA] border-t border-[#D7E0E8] font-semibold text-[13px] font-tabular">
                              <td colSpan={3} className="py-2.5 px-3.5 text-[#102A43]">
                                Approved Quote ({entity.quoteNumber})
                              </td>
                              <td className="py-2.5 px-3.5 text-right text-[#0F766E]">
                                {entity.quoteTotal}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      <div className="px-4 py-2.5 text-[12px] bg-[#102A43]/[0.04] border-t border-[#E5EBF0] text-[#526579] flex items-center justify-between gap-2">
                        <span>
                          {paymentAllocated
                            ? `Payment of ${entity.symbol}${entity.partialPaymentAmount} applied · Remaining balance ${entity.symbol}${entity.remainingAfterPayment}`
                            : 'Approved prices, tax rates, and currency stay locked even if your catalogue changes later.'}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
