import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Building2,
  CheckCircle2,
  FileCheck2,
  Layers,
  Lock,
  Scale,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { Reveal } from '@metr/ui';
import { RELIABILITY_METRICS, TRUST_SHOWCASE_TABS } from '../data/metrContent';

type TrustTab = 'financial' | 'entities' | 'approvals' | 'privacy';

const PLATFORM_PILLARS = [
  {
    icon: Layers,
    layer: 'Unified Business Workspace',
    detail:
      'One fast, consistent workspace for sales, operations, and finance—no juggling disconnected spreadsheets or apps.',
  },
  {
    icon: UserCheck,
    layer: 'Built-In Approval Controls',
    detail:
      'Multi-step sign-offs prevent staff from approving their own high-value quotes, purchases, or payouts.',
  },
  {
    icon: Scale,
    layer: 'Audit-Ready Financial Core',
    detail:
      'Every transaction balances automatically and leaves a permanent, tamper-proof trail for external auditors.',
  },
  {
    icon: Lock,
    layer: 'Encrypted Files & Continuous Backups',
    detail:
      'Contracts, invoices, and receipts stay privately encrypted with automated backups and tested rapid recovery.',
  },
];

const TRUST_TABS: { id: TrustTab; label: string; icon: typeof Scale }[] = [
  { id: 'financial', label: 'Financial Safeguards', icon: Scale },
  { id: 'entities', label: 'Multi-Company Control', icon: Building2 },
  { id: 'approvals', label: 'Approvals & Access', icon: FileCheck2 },
  { id: 'privacy', label: 'Privacy & Continuity', icon: ShieldCheck },
];

export function ArchitectureTrustSection() {
  const [activeTab, setActiveTab] = useState<TrustTab>('financial');
  const currentTabData = TRUST_SHOWCASE_TABS[activeTab];

  return (
    <section
      id="architecture"
      className="bg-[#102A43] text-white border-b border-[#172B4D] py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left 5 Columns: Business Trust & Platform Pillars */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#2DD4BF] mb-3">
                  Trust, Security & Controls
                </p>
                <h2 className="font-[Manrope] text-[28px] sm:text-[36px] lg:text-[40px] font-bold leading-[1.2] tracking-[-0.02em] text-white">
                  Built for financial accuracy, strict privacy, and audit readiness.
                </h2>
                <p className="mt-4 text-[15px] sm:text-[16px] leading-[26px] text-[#D1E4FF]">
                  3Metr keeps your operations, approvals, and financial books inside one tightly
                  governed platform—so every number is traceable, every company stays cleanly
                  separated, and nothing falls through the cracks.
                </p>
              </div>

              {/* Clean Platform Pillars List */}
              <div className="rounded-[1rem] bg-[#0B1724] border border-white/10 divide-y divide-white/[0.08]">
                {PLATFORM_PILLARS.map((row) => {
                  const Icon = row.icon;
                  return (
                    <div key={row.layer} className="p-4 flex items-start gap-3.5">
                      <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-[0.5rem] bg-[#102A43] border border-white/10 text-[#2DD4BF] shrink-0">
                        <Icon size={16} aria-hidden="true" />
                      </span>
                      <div>
                        <div className="text-[13px] font-semibold text-white">{row.layer}</div>
                        <div className="text-[13px] text-[#B0C9E8] mt-0.5 leading-[20px]">
                          {row.detail}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 7 Columns: Dark Surface Interactive Controls & Assurance Showcase */}
            <div className="lg:col-span-7">
              <div className="rounded-[1.25rem] bg-[#0B1724] border border-white/12 overflow-hidden">
                {/* Tab Bar */}
                <div
                  role="tablist"
                  aria-label="Platform trust and safeguard views"
                  className="flex flex-wrap items-center gap-1 p-2.5 bg-[#08121D] border-b border-white/10"
                >
                  {TRUST_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setActiveTab(tab.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[0.5rem] text-[12px] font-semibold transition-colors whitespace-nowrap shrink-0 metr-focus ${
                          active
                            ? 'bg-[#0F766E] text-white'
                            : 'text-[#B0C9E8] hover:text-white hover:bg-white/[0.06]'
                        }`}
                      >
                        <Icon size={13} aria-hidden="true" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <div className="p-5 sm:p-6 min-h-[380px] flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#80D5CB]">
                        <span>{currentTabData.headerLeft}</span>
                        <span>{currentTabData.headerRight}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentTabData.cards.map((card) => (
                          <div
                            key={card.title}
                            className="rounded-[0.75rem] bg-[#102A43]/70 border border-white/10 p-4 flex flex-col justify-between gap-3"
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="font-[Manrope] text-[15px] font-bold text-white leading-snug">
                                  {card.title}
                                </h3>
                                <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#2DD4BF] whitespace-nowrap shrink-0">
                                  {card.badge}
                                </span>
                              </div>
                              <p className="text-[13px] leading-[20px] text-[#D1E4FF]">
                                {card.summary}
                              </p>
                            </div>

                            <ul className="space-y-1.5 pt-2.5 border-t border-white/[0.08]">
                              {card.highlights.map((item) => (
                                <li
                                  key={item}
                                  className="flex items-start gap-2 text-[12px] leading-[17px] text-[#B0C9E8]"
                                >
                                  <CheckCircle2
                                    size={13}
                                    className="text-[#2DD4BF] mt-0.5 shrink-0"
                                    aria-hidden="true"
                                  />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Platform Reliability & Security Commitments Strip */}
        <Reveal delay={0.1}>
          <div className="mt-12 pt-10 border-t border-white/12">
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
              <h3 className="font-[Manrope] text-[18px] font-bold text-white">
                Platform Reliability & Security Commitments
              </h3>
              <p className="text-[12px] text-[#B0C9E8]">
                Routinely verified through uptime checks, backup drills, and company privacy audits.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {RELIABILITY_METRICS.map((metric) => (
                <div
                  key={metric.id}
                  className="rounded-[1rem] bg-[#0B1724] border border-white/10 p-4 flex flex-col justify-between gap-2"
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#80D5CB]">
                    {metric.eyebrow}
                  </span>
                  <span className="font-[Manrope] font-tabular text-[22px] font-bold text-white leading-tight">
                    {metric.value}
                  </span>
                  <span className="text-[12px] text-[#B0C9E8] leading-[17px]">
                    {metric.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
