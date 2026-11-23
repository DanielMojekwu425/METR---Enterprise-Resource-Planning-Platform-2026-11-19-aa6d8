import React from 'react';
import { motion } from 'motion/react';
import { Check, Lock } from 'lucide-react';

export interface WorkflowStage {
  id: string;
  label: string;
  statusLabel: string;
  summary: string;
  statusFlow: string;
  safeguard: string;
  teamAction: string;
  automaticResult: string;
  isTerminalLedger?: boolean;
}

export interface WorkflowPipelineProps {
  stages: WorkflowStage[];
  activeStageId: string;
  onSelectStage: (stageId: string) => void;
}

/**
 * "Connected Movement" Signature Component:
 * Horizontal lifecycle pipeline linked by 2px #D7E0E8 connectors with centered 8px circular nodes.
 * Active/completed stages illuminate to solid #0F766E with a #2DD4BF interior accelerator node.
 */
export function WorkflowPipeline({
  stages,
  activeStageId,
  onSelectStage,
}: WorkflowPipelineProps) {
  const activeIndex = Math.max(
    0,
    stages.findIndex((s) => s.id === activeStageId)
  );

  return (
    <div
      className="w-full"
      role="tablist"
      aria-label="Connected business workflow stages"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-0 items-stretch">
        {stages.map((stage, idx) => {
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;
          const isIlluminated = isCompleted || isActive;

          return (
            <div key={stage.id} className="flex items-center">
              <motion.button
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectStage(stage.id)}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className={`relative w-full h-full text-left rounded-[0.75rem] p-5 border transition-all duration-150 metr-focus flex flex-col justify-between gap-3 ${
                  isActive
                    ? 'bg-white border-[#0F766E] shadow-[0_10px_24px_-4px_rgba(16,42,69,0.08),0_4px_8px_-2px_rgba(16,42,69,0.04)]'
                    : isCompleted
                    ? 'bg-white border-[#0F766E]/35 shadow-[0_1px_3px_rgba(16,42,69,0.04)]'
                    : 'bg-white border-[#D7E0E8] hover:border-[#0F766E]/35 shadow-[0_1px_3px_rgba(16,42,69,0.04)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-tabular text-[11px] font-semibold tracking-[0.04em] uppercase text-[#526579]">
                    Step 0{idx + 1}
                  </span>
                  {stage.isTerminalLedger ? (
                    <span className="inline-flex items-center gap-1 rounded-[0.375rem] bg-[#102A43] px-2 py-0.5 text-[10px] font-semibold text-[#EDF0FF] whitespace-nowrap shrink-0">
                      <Lock size={10} aria-hidden="true" />
                      Books Balanced
                    </span>
                  ) : isCompleted ? (
                    <span
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#0F766E]/10 text-[#0F766E]"
                      aria-hidden="true"
                    >
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                  ) : isActive ? (
                    <span
                      className="inline-flex h-2.5 w-2.5 rounded-full bg-[#2DD4BF] ring-4 ring-[#0F766E]/15"
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      className="inline-flex h-2 w-2 rounded-full bg-[#D7E0E8]"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <div>
                  <div
                    className={`font-[Manrope] text-[16px] font-bold leading-[22px] tracking-[-0.01em] ${
                      isActive ? 'text-[#0F766E]' : 'text-[#172B4D]'
                    }`}
                  >
                    {stage.label}
                  </div>
                  <div className="mt-1 text-[12px] font-medium text-[#526579] leading-[18px]">
                    {stage.statusLabel}
                  </div>
                </div>
              </motion.button>

              {/* Desktop horizontal connector between cards */}
              {idx < stages.length - 1 && (
                <div
                  className="hidden lg:flex items-center justify-center w-6 shrink-0 relative"
                  aria-hidden="true"
                >
                  <div
                    className={`h-[2px] w-full transition-colors duration-200 ${
                      isCompleted ? 'bg-[#0F766E]' : 'bg-[#D7E0E8]'
                    }`}
                  />
                  <span
                    className={`absolute h-2 w-2 rounded-full border-2 transition-colors duration-200 ${
                      isCompleted
                        ? 'bg-[#2DD4BF] border-[#0F766E]'
                        : isIlluminated
                        ? 'bg-white border-[#0F766E]'
                        : 'bg-white border-[#D7E0E8]'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
