import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Layers,
  Link2,
  X,
} from 'lucide-react';
import type { ReleasePhase } from '@metr/contracts';
import { PhaseBadge, Reveal } from '@metr/ui';
import { ERP_MODULES, type ErpModuleItem } from '../data/metrContent';

type PhaseFilter = 'All' | ReleasePhase;

const FILTER_OPTIONS: { value: PhaseFilter; label: string }[] = [
  { value: 'All', label: 'All Modules' },
  { value: 'Phase 1', label: 'Phase 1: Core' },
  { value: 'Phase 2', label: 'Phase 2: Operations' },
  { value: 'Phase 3', label: 'Phase 3: Expansion' },
];

export function ModulesGridSection() {
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>('All');
  const [selectedModule, setSelectedModule] = useState<ErpModuleItem | null>(null);
  const inspectorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedModule && inspectorRef.current) {
      inspectorRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedModule]);

  const visibleModules = useMemo(() => {
    if (phaseFilter === 'All') return ERP_MODULES;
    return ERP_MODULES.filter((mod) => mod.phase === phaseFilter);
  }, [phaseFilter]);

  return (
    <section id="modules" className="bg-[#F5F7FA] border-b border-[#E5EBF0] py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#0F766E] mb-3">
                Platform Modules
              </p>
              <h2 className="font-[Manrope] text-[28px] sm:text-[36px] lg:text-[40px] font-bold leading-[1.2] tracking-[-0.02em] text-[#102A43]">
                12 connected modules. One unified workspace.
              </h2>
              <p className="mt-3 text-[15px] sm:text-[16px] leading-[26px] text-[#526579]">
                Start with core sales, invoicing, and accounting—then activate purchasing,
                inventory, projects, and HR as your business grows. Click any module to explore
                what it includes.
              </p>
            </div>

            {/* Interactive Phase Filter Bar */}
            <div className="flex flex-col items-start lg:items-end gap-2">
              <div
                role="group"
                aria-label="Filter modules by rollout phase"
                className="inline-flex flex-wrap items-center gap-1 rounded-[0.75rem] bg-white p-1 border border-[#D7E0E8]"
              >
                {FILTER_OPTIONS.map((opt) => {
                  const active = phaseFilter === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setPhaseFilter(opt.value)}
                      className={`px-3.5 py-2 rounded-[0.5rem] text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 metr-focus ${
                        active
                          ? 'bg-[#0F766E] text-white'
                          : 'text-[#526579] hover:text-[#172B4D] hover:bg-[#F5F7FA]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-[12px] font-medium text-[#526579] font-tabular">
                Showing {visibleModules.length} business{' '}
                {visibleModules.length === 1 ? 'module' : 'modules'}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleModules.map((mod, idx) => {
            const isSelected = selectedModule?.id === mod.id;
            return (
              <motion.button
                key={mod.id}
                type="button"
                layout="position"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(idx * 0.04, 0.2),
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() => setSelectedModule(isSelected ? null : mod)}
                aria-expanded={isSelected}
                className={`metr-card metr-card-interactive text-left rounded-[1rem] p-6 flex flex-col justify-between gap-5 metr-focus ${
                  isSelected
                    ? 'border-[#0F766E] ring-2 ring-[#0F766E]/15'
                    : ''
                }`}
              >
                <div className="space-y-3">
                  {/* Clean category + Phase indicator */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#526579] truncate">
                      {mod.category}
                    </span>
                    <PhaseBadge phase={mod.phase} />
                  </div>

                  <div>
                    <h3 className="font-[Manrope] text-[20px] font-bold leading-[28px] tracking-[-0.01em] text-[#102A43]">
                      {mod.name}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[22px] text-[#3E4947]">
                      {mod.summary}
                    </p>
                  </div>
                </div>

                {/* Clean footer row */}
                <div className="pt-4 border-t border-[#E5EBF0] flex items-center justify-between gap-3">
                  <span className="text-[12px] font-medium text-[#526579] font-tabular">
                    {mod.includedTools.length} core capabilities
                  </span>
                  <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0F766E] whitespace-nowrap shrink-0">
                    {isSelected ? 'Viewing below' : 'Explore module'}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Interactive Module Details Panel */}
        <AnimatePresence>
          {selectedModule && (
            <motion.div
              ref={inspectorRef}
              key={selectedModule.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              role="region"
              aria-label={`${selectedModule.name} details`}
              className="mt-8 rounded-[1.5rem] bg-[#102A43] text-white border border-[#172B4D] p-6 sm:p-8 shadow-[0_16px_36px_-8px_rgba(16,42,69,0.22)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-white/10">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#2DD4BF]">
                    <span>{selectedModule.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedModule.phase}</span>
                  </div>
                  <h3 className="font-[Manrope] text-[24px] sm:text-[28px] font-bold text-white">
                    {selectedModule.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedModule(null)}
                  aria-label="Close module details"
                  className="inline-flex items-center gap-1.5 rounded-[0.5rem] bg-white/10 hover:bg-white/15 px-3.5 py-2 text-[13px] font-semibold text-white transition-colors metr-focus"
                >
                  <X size={15} aria-hidden="true" />
                  Close Details
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
                {/* Business Scope & Connections */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="rounded-[0.75rem] bg-[#0B1724] border border-white/10 p-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#2DD4BF]">
                      <Layers size={14} aria-hidden="true" />
                      <span>What This Module Manages</span>
                    </div>
                    <p className="text-[14px] leading-[22px] text-[#EDF0FF]">
                      {selectedModule.manages}
                    </p>
                  </div>

                  <div className="rounded-[0.75rem] bg-[#0B1724] border border-white/10 p-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#B0C9E8]">
                      <Link2 size={14} aria-hidden="true" />
                      <span>Connects Seamlessly With</span>
                    </div>
                    <p className="text-[14px] leading-[22px] text-[#D1E4FF]">
                      {selectedModule.connectsWith}
                    </p>
                  </div>
                </div>

                {/* Included Tools & Key Team Workflows */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-[0.75rem] bg-[#0B1724] border border-white/10 p-5">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#2DD4BF] mb-3">
                      <Briefcase size={14} aria-hidden="true" />
                      <span>Included Capabilities</span>
                    </div>
                    <ul className="space-y-2">
                      {selectedModule.includedTools.map((tool) => (
                        <li
                          key={tool}
                          className="text-[13px] text-[#EDF0FF] py-1 border-b border-white/[0.06] last:border-b-0"
                        >
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[0.75rem] bg-[#0B1724] border border-white/10 p-5">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#2DD4BF] mb-3">
                      <CheckCircle2 size={14} aria-hidden="true" />
                      <span>Key Team Workflows</span>
                    </div>
                    <ul className="space-y-2">
                      {selectedModule.keyWorkflows.map((wf) => (
                        <li
                          key={wf}
                          className="text-[13px] text-[#9CF2E8] py-1 border-b border-white/[0.06] last:border-b-0"
                        >
                          {wf}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
