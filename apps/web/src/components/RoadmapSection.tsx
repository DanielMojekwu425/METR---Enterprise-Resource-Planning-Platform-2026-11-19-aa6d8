import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, ClipboardCheck, ShieldCheck } from 'lucide-react';
import { PhaseBadge, Reveal } from '@metr/ui';
import { ROADMAP_MILESTONES, VERTICAL_SLICES } from '../data/metrContent';

type RoadmapView = 'milestones' | 'slices';

export function RoadmapSection() {
  const [view, setView] = useState<RoadmapView>('milestones');
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>('m2');

  const activeMilestone =
    ROADMAP_MILESTONES.find((m) => m.id === activeMilestoneId) ?? ROADMAP_MILESTONES[0];

  return (
    <section id="roadmap" className="bg-white border-b border-[#E5EBF0] py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#0F766E] mb-3">
                Phased Rollout Plan
              </p>
              <h2 className="font-[Manrope] text-[28px] sm:text-[36px] lg:text-[40px] font-bold leading-[1.2] tracking-[-0.02em] text-[#102A43]">
                Start with core finance. Expand smoothly as you grow.
              </h2>
              <p className="mt-3 text-[15px] sm:text-[16px] leading-[26px] text-[#526579]">
                3Metr rolls out in complete, ready-to-use business stages—so your team goes live
                with sales and accounting first before activating purchasing, delivery, and HR.
              </p>
            </div>

            <div
              role="group"
              aria-label="Roadmap view mode"
              className="inline-flex items-center gap-1 rounded-[0.75rem] bg-[#F5F7FA] p-1 border border-[#D7E0E8] self-start lg:self-auto"
            >
              <button
                type="button"
                aria-pressed={view === 'milestones'}
                onClick={() => setView('milestones')}
                className={`px-3.5 py-2 rounded-[0.5rem] text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 metr-focus ${
                  view === 'milestones'
                    ? 'bg-white text-[#102A43] shadow-[0_1px_2px_rgba(16,42,69,0.08)]'
                    : 'text-[#526579] hover:text-[#172B4D]'
                }`}
              >
                Rollout Stages
              </button>
              <button
                type="button"
                aria-pressed={view === 'slices'}
                onClick={() => setView('slices')}
                className={`px-3.5 py-2 rounded-[0.5rem] text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 metr-focus ${
                  view === 'slices'
                    ? 'bg-white text-[#102A43] shadow-[0_1px_2px_rgba(16,42,69,0.08)]'
                    : 'text-[#526579] hover:text-[#172B4D]'
                }`}
              >
                Step-by-Step Timeline
              </button>
            </div>
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          {view === 'milestones' ? (
            <motion.div
              key="milestones"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* Left 5 Columns: Sequenced Stage Rail */}
              <div
                className="lg:col-span-5 flex flex-col gap-3"
                role="tablist"
                aria-label="Rollout stages"
              >
                {ROADMAP_MILESTONES.map((ms) => {
                  const isActive = ms.id === activeMilestone.id;
                  return (
                    <button
                      key={ms.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveMilestoneId(ms.id)}
                      className={`w-full text-left rounded-[0.875rem] p-4 border transition-all duration-150 metr-focus flex items-center justify-between gap-4 ${
                        isActive
                          ? 'bg-[#F5F7FA] border-[#0F766E] shadow-[0_4px_12px_rgba(16,42,69,0.06)]'
                          : 'bg-white border-[#D7E0E8] hover:border-[#0F766E]/40 hover:bg-[#F5F7FA]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-[0.5rem] font-tabular text-[13px] font-bold shrink-0 ${
                            isActive
                              ? 'bg-[#0F766E] text-white'
                              : 'bg-[#102A43]/[0.06] text-[#102A43]'
                          }`}
                        >
                          {ms.stepNumber}
                        </span>
                        <div className="min-w-0">
                          <div
                            className={`font-[Manrope] text-[16px] font-bold truncate ${
                              isActive ? 'text-[#0F766E]' : 'text-[#102A43]'
                            }`}
                          >
                            {ms.title}
                          </div>
                          <div className="text-[12px] text-[#526579] mt-0.5">
                            {ms.deliverables.length} key capabilities
                          </div>
                        </div>
                      </div>
                      <PhaseBadge phase={ms.phase} />
                    </button>
                  );
                })}
              </div>

              {/* Right 7 Columns: Selected Stage Highlights Card */}
              <div className="lg:col-span-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMilestone.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="metr-card rounded-[1.25rem] p-6 sm:p-8 space-y-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#E5EBF0]">
                      <div>
                        <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#0F766E]">
                          Stage {activeMilestone.stepNumber}
                        </span>
                        <h3 className="font-[Manrope] text-[24px] sm:text-[28px] font-bold text-[#102A43] mt-0.5">
                          {activeMilestone.title}
                        </h3>
                      </div>
                      <PhaseBadge phase={activeMilestone.phase} />
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#526579]">
                        What Your Team Gets
                      </h4>
                      <ul className="space-y-3">
                        {activeMilestone.deliverables.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-[15px] leading-[24px] text-[#172B4D]"
                          >
                            <CheckCircle2
                              size={18}
                              className="text-[#0F766E] mt-0.5 shrink-0"
                              aria-hidden="true"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="rounded-[0.75rem] bg-[#F5F7FA] border border-[#E5EBF0] p-4 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#102A43]">
                          <ClipboardCheck size={14} className="text-[#0F766E]" aria-hidden="true" />
                          <span>How You’ll See It Working</span>
                        </div>
                        <p className="text-[13px] leading-[20px] text-[#3E4947]">
                          {activeMilestone.reviewEvidence}
                        </p>
                      </div>

                      <div className="rounded-[0.75rem] bg-[#F5F7FA] border border-[#E5EBF0] p-4 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#102A43]">
                          <ShieldCheck size={14} className="text-[#0F766E]" aria-hidden="true" />
                          <span>Go-Live Readiness Check</span>
                        </div>
                        <p className="text-[13px] leading-[20px] text-[#3E4947]">
                          {activeMilestone.exitGate}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="slices"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="metr-card rounded-[1rem] overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F5F7FA] border-b border-[#D7E0E8] text-[11px] font-bold uppercase tracking-[0.08em] text-[#526579]">
                      <th className="py-3.5 px-5 w-28">Stage</th>
                      <th className="py-3.5 px-5">Business Capability Delivered</th>
                      <th className="py-3.5 px-5">Readiness Milestone</th>
                      <th className="py-3.5 px-5 text-right">Phase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EBF0] text-[14px]">
                    {VERTICAL_SLICES.map((slice) => (
                      <tr key={slice.sequence} className="hover:bg-[#F5F7FA]/60 transition-colors">
                        <td className="py-4 px-5 font-tabular font-bold text-[#0F766E] whitespace-nowrap">
                          Stage 0{slice.sequence}
                        </td>
                        <td className="py-4 px-5 font-medium text-[#172B4D]">
                          {slice.outcome}
                        </td>
                        <td className="py-4 px-5 text-[#526579]">{slice.exitGate}</td>
                        <td className="py-4 px-5 text-right">
                          <PhaseBadge phase={slice.phase} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
