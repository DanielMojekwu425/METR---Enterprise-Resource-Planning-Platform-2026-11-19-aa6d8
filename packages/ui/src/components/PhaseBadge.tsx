import React from 'react';
import type { ReleasePhase } from '@metr/contracts';

export interface PhaseBadgeProps {
  phase: ReleasePhase;
  label?: string;
  className?: string;
}

const phaseStyleMap: Record<ReleasePhase, string> = {
  'Phase 1': 'bg-[#0F766E]/[0.08] text-[#0F766E] border-[#0F766E]/20',
  'Phase 2': 'bg-[#102A43]/[0.06] text-[#102A43] border-[#D7E0E8]',
  'Phase 3': 'bg-[#F5F7FA] text-[#526579] border-[#E5EBF0]',
};

/**
 * Calibrated Phase Indicator matching Precision Ledger & Flow specifications.
 */
export function PhaseBadge({ phase, label, className = '' }: PhaseBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-[0.375rem] border px-2 py-0.5 text-[11px] font-bold tracking-[0.04em] leading-4 whitespace-nowrap shrink-0 ${phaseStyleMap[phase]} ${className}`}
    >
      {label ?? phase}
    </span>
  );
}
