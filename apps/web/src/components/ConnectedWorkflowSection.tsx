import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CheckSquare, GitCommitHorizontal, ShieldCheck } from 'lucide-react';
import { PhaseBadge, Reveal, WorkflowPipeline } from '@metr/ui';
import { ENTERPRISE_JOURNEYS } from '../data/metrContent';

export function ConnectedWorkflowSection() {
  const [selectedJourneyId, setSelectedJourneyId] = useState(ENTERPRISE_JOURNEYS[0].id);
  const currentJourney =
    ENTERPRISE_JOURNEYS.find((j) => j.id === selectedJourneyId) ?? ENTERPRISE_JOURNEYS[0];

  const [selectedStageByJourney, setSelectedStageByJourney] = useState<Record<string, string>>({
    'lead-to-cash': 'ledger',
    'procure-to-pay': 'bill',
    'contract-to-renewal': 'renewal',
  });

  const activeStageId =
    selectedStageByJourney[currentJourney.id] ?? currentJourney.stages[0].id;
  const activeStageIndex = Math.max(
    0,
    currentJourney.stages.findIndex((s) => s.id === activeStageId)
  );
  const activeStage = currentJourney.stages[activeStageIndex] ?? currentJourney.stages[0];

  const handleSelectStage = (stageId: string) => {
    setSelectedStageByJourney((prev) => ({
      ...prev,
      [currentJourney.id]: stageId,
    }));
  };

  return (
    <section id="workflow" className="bg-white border-b border-[#E5EBF0] py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#0F766E] mb-3">
                Connected Workflows
              </p>
              <h2 className="font-[Manrope] text-[28px] sm:text-[36px] lg:text-[40px] font-bold leading-[1.2] tracking-[-0.02em] text-[#102A43]">
                Every business step connected from first quote to final books.
              </h2>
              <p className="mt-3 text-[15px] sm:text-[16px] leading-[26px] text-[#526579]">
                Choose a core workflow and click any stage to see how approvals, built-in safeguards,
                and financial updates stay seamlessly in sync.
              </p>
            </div>

            {/* Segmented Journey Switcher */}
            <div
              role="group"
              aria-label="Select business workflow"
              className="inline-flex flex-wrap items-center gap-1 rounded-[0.75rem] bg-[#F5F7FA] p-1 border border-[#D7E0E8] self-start lg:self-auto"
            >
              {ENTERPRISE_JOURNEYS.map((journey) => {
                const active = journey.id === currentJourney.id;
                return (
                  <button
                    key={journey.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedJourneyId(journey.id)}
                    className={`px-3.5 py-2 rounded-[0.5rem] text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 metr-focus ${
                      active
                        ? 'bg-white text-[#102A43] shadow-[0_1px_2px_rgba(16,42,69,0.08)]'
                        : 'text-[#526579] hover:text-[#172B4D]'
                    }`}
                  >
                    {journey.title}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Journey Context Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[14px] text-[#3E4947] max-w-3xl">{currentJourney.description}</p>
          <PhaseBadge phase={currentJourney.phase} />
        </div>

        {/* Horizontal Connected Movement Pipeline */}
        <WorkflowPipeline
          stages={currentJourney.stages}
          activeStageId={activeStage.id}
          onSelectStage={handleSelectStage}
        />

        {/* Selected Stage Business Detail Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentJourney.id}-${activeStage.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 rounded-[1rem] border border-[#D7E0E8] bg-[#F5F7FA] p-6 lg:p-7"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#0F766E]">
                  <span>Step 0{activeStageIndex + 1}</span>
                  <span aria-hidden="true">·</span>
                  <span>Stage Overview</span>
                </div>
                <h3 className="font-[Manrope] text-[22px] font-bold text-[#102A43]">
                  {activeStage.label} — {activeStage.statusLabel}
                </h3>
                <p className="text-[15px] leading-[24px] text-[#3E4947]">
                  {activeStage.summary}
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-[0.75rem] bg-white border border-[#D7E0E8] p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#526579]">
                    <GitCommitHorizontal size={14} className="text-[#0F766E]" aria-hidden="true" />
                    <span>Approval & Status Flow</span>
                  </div>
                  <p className="text-[13px] font-medium leading-[20px] text-[#102A43]">
                    {activeStage.statusFlow}
                  </p>
                </div>

                <div className="rounded-[0.75rem] bg-white border border-[#D7E0E8] p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#526579]">
                    <ShieldCheck size={14} className="text-[#0F766E]" aria-hidden="true" />
                    <span>Built-In Safeguard</span>
                  </div>
                  <p className="text-[13px] leading-[20px] text-[#172B4D]">
                    {activeStage.safeguard}
                  </p>
                </div>

                <div className="rounded-[0.75rem] bg-white border border-[#D7E0E8] p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#526579]">
                    <CheckSquare size={14} className="text-[#102A43]" aria-hidden="true" />
                    <span>Team Action</span>
                  </div>
                  <p className="text-[13px] leading-[20px] text-[#0F766E] font-medium">
                    {activeStage.teamAction}
                  </p>
                </div>

                <div className="rounded-[0.75rem] bg-white border border-[#D7E0E8] p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#526579]">
                    <ArrowRight size={14} className="text-[#102A43]" aria-hidden="true" />
                    <span>Automatic Follow-On</span>
                  </div>
                  <p className="text-[13px] leading-[20px] text-[#102A43] font-medium">
                    {activeStage.automaticResult}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
